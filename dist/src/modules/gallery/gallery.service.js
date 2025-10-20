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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const gallery_pairs_service_1 = require("./gallery-pairs.service");
let GalleryService = class GalleryService {
    constructor(prisma, pairsService) {
        this.prisma = prisma;
        this.pairsService = pairsService;
    }
    listAlbums() {
        return this.prisma.album.findMany({ orderBy: { createdAt: "desc" } });
    }
    getAlbum(id) {
        return this.prisma.album.findUnique({ where: { id } });
    }
    async createAlbum(dto) {
        return this.prisma.album.create({ data: dto });
    }
    async updateAlbum(id, dto) {
        await this.ensureAlbum(id);
        return this.prisma.album.update({ where: { id }, data: dto });
    }
    async deleteAlbum(id) {
        await this.ensureAlbum(id);
        await this.prisma.album.delete({ where: { id } });
    }
    listPhotos(albumId, tag) {
        const where = { albumId };
        if (tag) {
            where.tag = tag;
        }
        return this.prisma.galleryPhoto.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    }
    async addPhoto(dto) {
        await this.ensureAlbum(dto.albumId);
        const photo = await this.prisma.galleryPhoto.create({ data: dto });
        const album = await this.prisma.album.findUnique({
            where: { id: dto.albumId },
        });
        if ((album === null || album === void 0 ? void 0 : album.type) === client_1.AlbumType.BEFORE_AFTER) {
            await this.pairsService.createPairsAutomatically(dto.albumId);
        }
        return photo;
    }
    async updatePhoto(id, dto) {
        await this.ensurePhoto(id);
        return this.prisma.galleryPhoto.update({ where: { id }, data: dto });
    }
    async deletePhoto(id) {
        await this.ensurePhoto(id);
        const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
        const album = await this.prisma.album.findUnique({
            where: { id: photo.albumId },
        });
        await this.prisma.galleryPhoto.delete({ where: { id } });
        if ((album === null || album === void 0 ? void 0 : album.type) === client_1.AlbumType.BEFORE_AFTER) {
            await this.pairsService.createPairsAutomatically(photo.albumId);
        }
    }
    listPairs(albumId) {
        return this.prisma.beforeAfterPair.findMany({
            where: { albumId },
            orderBy: { createdAt: "desc" },
        });
    }
    async createPair(dto) {
        await this.ensureAlbum(dto.albumId);
        await this.ensurePhoto(dto.beforePhotoId);
        await this.ensurePhoto(dto.afterPhotoId);
        return this.prisma.beforeAfterPair.create({ data: dto });
    }
    async deletePair(id) {
        await this.ensurePair(id);
        await this.prisma.beforeAfterPair.delete({ where: { id } });
    }
    async ensureAlbum(id) {
        const album = await this.prisma.album.findUnique({ where: { id } });
        if (!album)
            throw new common_1.NotFoundException("Album not found");
    }
    async ensurePhoto(id) {
        const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
        if (!photo)
            throw new common_1.NotFoundException("Photo not found");
    }
    async ensurePair(id) {
        const pair = await this.prisma.beforeAfterPair.findUnique({
            where: { id },
        });
        if (!pair)
            throw new common_1.NotFoundException("Pair not found");
    }
    async recreatePairs(albumId) {
        await this.ensureAlbum(albumId);
        await this.pairsService.createPairsAutomatically(albumId);
    }
    async deleteCollection(albumId, collectionId, deletePhotos = false) {
        await this.ensureAlbum(albumId);
        return this.pairsService.deleteCollection(albumId, collectionId, deletePhotos);
    }
    async getPairsByCollection(albumId, collectionId) {
        await this.ensureAlbum(albumId);
        return this.pairsService.getPairsByCollection(albumId, collectionId);
    }
    async getPairs(albumId) {
        await this.ensureAlbum(albumId);
        return this.pairsService.getPairsWithPhotos(albumId);
    }
};
GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gallery_pairs_service_1.GalleryPairsService])
], GalleryService);
exports.GalleryService = GalleryService;
//# sourceMappingURL=gallery.service.js.map