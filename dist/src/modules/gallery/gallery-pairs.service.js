"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryPairsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_1 = require("cloudinary");
let GalleryPairsService = class GalleryPairsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPairsAutomatically(albumId) {
        const photos = await this.prisma.galleryPhoto.findMany({
            where: { albumId },
            orderBy: { createdAt: "asc" },
        });
        const beforePhotos = photos.filter((photo) => photo.tag === "before");
        const afterPhotos = photos.filter((photo) => photo.tag === "after");
        console.log(`Found ${beforePhotos.length} "До" photos and ${afterPhotos.length} "Після" photos`);
        if (beforePhotos.length < 3 || afterPhotos.length < 3) {
            console.log("Not enough photos to create pairs (need 3+3)");
            return;
        }
        const existingPairs = await this.prisma.beforeAfterPair.findMany({
            where: { albumId },
            select: { beforePhotoId: true, afterPhotoId: true, collectionId: true },
        });
        const collectionsToCreate = [];
        const maxCollections = Math.min(Math.floor(beforePhotos.length / 3), Math.floor(afterPhotos.length / 3));
        for (let collectionId = 1; collectionId <= maxCollections; collectionId++) {
            const startBefore = (collectionId - 1) * 3;
            const startAfter = (collectionId - 1) * 3;
            for (let i = 0; i < 3; i++) {
                const beforePhoto = beforePhotos[startBefore + i];
                const afterPhoto = afterPhotos[startAfter + i];
                if (beforePhoto && afterPhoto) {
                    const pairExists = existingPairs.some((pair) => pair.beforePhotoId === beforePhoto.id &&
                        pair.afterPhotoId === afterPhoto.id &&
                        pair.collectionId === collectionId);
                    if (!pairExists) {
                        collectionsToCreate.push({
                            albumId,
                            beforePhotoId: beforePhoto.id,
                            afterPhotoId: afterPhoto.id,
                            label: `Колекція ${collectionId} - Пара ${i + 1}`,
                            collectionId: collectionId,
                        });
                    }
                }
            }
        }
        if (collectionsToCreate.length > 0) {
            await this.prisma.beforeAfterPair.createMany({
                data: collectionsToCreate,
            });
            console.log(`Created ${collectionsToCreate.length} pairs in ${maxCollections} collections automatically`);
        }
    }
    async getPairsWithPhotos(albumId) {
        const pairs = await this.prisma.beforeAfterPair.findMany({
            where: { albumId },
            include: {
                beforePhoto: true,
                afterPhoto: true,
            },
            orderBy: { createdAt: "asc" },
        });
        return pairs.map((pair) => {
            const { id } = pair, rest = __rest(pair, ["id"]);
            return Object.assign({ key: id }, rest);
        });
    }
    async getCollections(albumId) {
        const pairs = await this.getPairsWithPhotos(albumId);
        const collections = {};
        pairs.forEach((pair) => {
            const collectionId = pair.collectionId || 1;
            if (!collections[collectionId]) {
                collections[collectionId] = [];
            }
            collections[collectionId].push(pair);
        });
        return Object.keys(collections).map((collectionId) => ({
            key: parseInt(collectionId),
            pairs: collections[collectionId],
            count: collections[collectionId].length,
        }));
    }
    async canCreatePairs(albumId) {
        const photos = await this.prisma.galleryPhoto.findMany({
            where: { albumId },
        });
        const beforeCount = photos.filter((photo) => photo.tag === "before").length;
        const afterCount = photos.filter((photo) => photo.tag === "after").length;
        return beforeCount >= 3 && afterCount >= 3;
    }
    async deleteCollection(albumId, collectionId, deletePhotos = true) {
        const pairs = await this.prisma.beforeAfterPair.findMany({
            where: { albumId, collectionId },
            include: { beforePhoto: true, afterPhoto: true },
        });
        if (pairs.length === 0) {
            return { deletedPairs: 0, deletedPhotos: 0 };
        }
        await this.prisma.beforeAfterPair.deleteMany({
            where: { albumId, collectionId },
        });
        let deletedPhotos = 0;
        if (deletePhotos) {
            const photoIds = new Set();
            pairs.forEach((pair) => {
                photoIds.add(pair.beforePhotoId);
                photoIds.add(pair.afterPhotoId);
            });
            for (const photoId of photoIds) {
                const otherPairs = await this.prisma.beforeAfterPair.findMany({
                    where: {
                        OR: [{ beforePhotoId: photoId }, { afterPhotoId: photoId }],
                    },
                });
                if (otherPairs.length === 0) {
                    const photo = await this.prisma.galleryPhoto.findUnique({
                        where: { id: photoId },
                    });
                    if (photo) {
                        if (photo.publicId) {
                            try {
                                console.log(`Would delete from Cloudinary: ${photo.publicId}`);
                            }
                            catch (error) {
                                console.error(`Failed to delete from Cloudinary: ${photo.publicId}`, error);
                            }
                        }
                        await this.prisma.galleryPhoto.delete({
                            where: { id: photoId },
                        });
                        deletedPhotos++;
                    }
                }
            }
        }
        await this.cleanupOrphanedPhotos(albumId);
        return { deletedPairs: pairs.length, deletedPhotos };
    }
    async getPairsByCollection(albumId, collectionId) {
        return this.prisma.beforeAfterPair.findMany({
            where: { albumId, collectionId },
            include: {
                beforePhoto: true,
                afterPhoto: true,
            },
            orderBy: { createdAt: "asc" },
        });
    }
    async replaceBeforePhoto(pairId, newPhotoId) {
        const pair = await this.prisma.beforeAfterPair.findUnique({
            where: { id: pairId },
            include: { beforePhoto: true },
        });
        if (!pair) {
            throw new Error("Pair not found");
        }
        const updatedPair = await this.prisma.beforeAfterPair.update({
            where: { id: pairId },
            data: { beforePhotoId: newPhotoId },
            include: { beforePhoto: true, afterPhoto: true },
        });
        return updatedPair;
    }
    async replaceAfterPhoto(pairId, newPhotoId) {
        const pair = await this.prisma.beforeAfterPair.findUnique({
            where: { id: pairId },
            include: { afterPhoto: true },
        });
        if (!pair) {
            throw new Error("Pair not found");
        }
        const updatedPair = await this.prisma.beforeAfterPair.update({
            where: { id: pairId },
            data: { afterPhotoId: newPhotoId },
            include: { beforePhoto: true, afterPhoto: true },
        });
        return updatedPair;
    }
    async cleanupOrphanedPhotos(albumId) {
        const allPhotos = await this.prisma.galleryPhoto.findMany({
            where: { albumId },
        });
        const allPairs = await this.prisma.beforeAfterPair.findMany({
            where: { albumId },
            select: { beforePhotoId: true, afterPhotoId: true },
        });
        const usedPhotoIds = new Set();
        allPairs.forEach((pair) => {
            usedPhotoIds.add(pair.beforePhotoId);
            usedPhotoIds.add(pair.afterPhotoId);
        });
        const orphanedPhotos = allPhotos.filter((photo) => !usedPhotoIds.has(photo.id));
        let deletedCount = 0;
        for (const photo of orphanedPhotos) {
            try {
                if (photo.publicId) {
                    try {
                        await cloudinary_1.v2.uploader.destroy(photo.publicId);
                        console.log(`🗑️ Видалено з Cloudinary: ${photo.publicId}`);
                    }
                    catch (cloudinaryError) {
                        console.error(`Помилка видалення з Cloudinary ${photo.publicId}:`, cloudinaryError);
                    }
                }
                await this.prisma.galleryPhoto.delete({
                    where: { id: photo.id },
                });
                deletedCount++;
                console.log(`✅ Видалено сиротливе фото (ID: ${photo.id}, tag: ${photo.tag})`);
            }
            catch (error) {
                console.error(`Помилка видалення фото ${photo.id}:`, error);
            }
        }
        if (deletedCount > 0) {
            console.log(`🧹 Очищено ${deletedCount} сиротливих фото з альбому ${albumId}`);
        }
        return deletedCount;
    }
};
GalleryPairsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryPairsService);
exports.GalleryPairsService = GalleryPairsService;
//# sourceMappingURL=gallery-pairs.service.js.map