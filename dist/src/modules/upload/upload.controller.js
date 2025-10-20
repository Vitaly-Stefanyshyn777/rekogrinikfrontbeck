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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const auth_jwt_guard_1 = require("../auth/auth.jwt.guard");
const upload_service_1 = require("./upload.service");
const prisma_service_1 = require("../prisma/prisma.service");
const gallery_pairs_service_1 = require("../gallery/gallery-pairs.service");
let UploadController = class UploadController {
    constructor(uploadService, prisma, pairsService) {
        this.uploadService = uploadService;
        this.prisma = prisma;
        this.pairsService = pairsService;
    }
    async uploadImage(file) {
        console.log("Upload request received:", {
            file: file
                ? {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                }
                : null,
        });
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        try {
            const { url, publicId } = await this.uploadService.uploadImage(file.buffer, "rekogrinik");
            console.log("Upload successful:", { url, publicId });
            return { url, publicId };
        }
        catch (error) {
            console.error("Upload error:", error);
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
    async uploadPhoto(file, body) {
        console.log("Upload photo request:", {
            file: file ? { originalname: file.originalname, size: file.size } : null,
            body,
        });
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        const albumId = parseInt(body.albumId.toString());
        if (isNaN(albumId) || albumId <= 0) {
            throw new common_1.BadRequestException("Invalid albumId");
        }
        try {
            const { url, publicId } = await this.uploadService.uploadImage(file.buffer, "rekogrinik");
            const photo = await this.prisma.galleryPhoto.create({
                data: {
                    albumId: albumId,
                    url: url,
                    publicId: publicId,
                    title: body.title,
                    description: body.description,
                    tag: body.tag,
                },
            });
            const album = await this.prisma.album.findUnique({
                where: { id: albumId },
            });
            if ((album === null || album === void 0 ? void 0 : album.type) === "BEFORE_AFTER") {
                await this.pairsService.createPairsAutomatically(albumId);
                console.log("Auto-created pairs for BEFORE_AFTER album");
            }
            console.log("Photo saved successfully:", { id: photo.id, url });
            return { id: photo.id, url, publicId, title: photo.title };
        }
        catch (error) {
            console.error("Upload photo error:", error);
            throw new common_1.BadRequestException(`Upload failed: ${error.message}`);
        }
    }
    async replaceBeforePhoto(pairId, file, body) {
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        try {
            const { url, publicId } = await this.uploadService.uploadImage(file.buffer, "rekogrinik");
            const pair = await this.prisma.beforeAfterPair.findUnique({
                where: { id: pairId },
                include: { album: true, beforePhoto: true },
            });
            if (!pair) {
                throw new common_1.BadRequestException("Pair not found");
            }
            const newPhoto = await this.prisma.galleryPhoto.create({
                data: {
                    albumId: pair.albumId,
                    url: url,
                    publicId: publicId,
                    title: body.title,
                    description: body.description,
                    tag: "before",
                },
            });
            const updatedPair = await this.pairsService.replaceBeforePhoto(pairId, newPhoto.id);
            if (body.deleteOld === "true" && pair.beforePhoto) {
                const oldPhoto = pair.beforePhoto;
                const otherPairs = await this.prisma.beforeAfterPair.findMany({
                    where: {
                        OR: [{ beforePhotoId: oldPhoto.id }, { afterPhotoId: oldPhoto.id }],
                    },
                });
                if (otherPairs.length === 0) {
                    if (oldPhoto.publicId) {
                        await this.uploadService.deleteImage(oldPhoto.publicId);
                    }
                    await this.prisma.galleryPhoto.delete({
                        where: { id: oldPhoto.id },
                    });
                }
            }
            return {
                pairId: updatedPair.id,
                beforePhoto: {
                    id: newPhoto.id,
                    url: newPhoto.url,
                    publicId: newPhoto.publicId,
                    title: newPhoto.title,
                },
            };
        }
        catch (error) {
            console.error("Replace before photo error:", error);
            throw new common_1.BadRequestException(`Replace failed: ${error.message}`);
        }
    }
    async replaceAfterPhoto(pairId, file, body) {
        if (!file) {
            throw new common_1.BadRequestException("No file uploaded");
        }
        try {
            const { url, publicId } = await this.uploadService.uploadImage(file.buffer, "rekogrinik");
            const pair = await this.prisma.beforeAfterPair.findUnique({
                where: { id: pairId },
                include: { album: true, afterPhoto: true },
            });
            if (!pair) {
                throw new common_1.BadRequestException("Pair not found");
            }
            const newPhoto = await this.prisma.galleryPhoto.create({
                data: {
                    albumId: pair.albumId,
                    url: url,
                    publicId: publicId,
                    title: body.title,
                    description: body.description,
                    tag: "after",
                },
            });
            const updatedPair = await this.pairsService.replaceAfterPhoto(pairId, newPhoto.id);
            if (body.deleteOld === "true" && pair.afterPhoto) {
                const oldPhoto = pair.afterPhoto;
                const otherPairs = await this.prisma.beforeAfterPair.findMany({
                    where: {
                        OR: [{ beforePhotoId: oldPhoto.id }, { afterPhotoId: oldPhoto.id }],
                    },
                });
                if (otherPairs.length === 0) {
                    if (oldPhoto.publicId) {
                        await this.uploadService.deleteImage(oldPhoto.publicId);
                    }
                    await this.prisma.galleryPhoto.delete({
                        where: { id: oldPhoto.id },
                    });
                }
            }
            return {
                pairId: updatedPair.id,
                afterPhoto: {
                    id: newPhoto.id,
                    url: newPhoto.url,
                    publicId: newPhoto.publicId,
                    title: newPhoto.title,
                },
            };
        }
        catch (error) {
            console.error("Replace after photo error:", error);
            throw new common_1.BadRequestException(`Replace failed: ${error.message}`);
        }
    }
};
__decorate([
    (0, common_1.Post)("image"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            console.log("File filter check:", {
                mimetype: file.mimetype,
                originalname: file.originalname,
            });
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException("Only image files allowed"), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)("photo"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            console.log("File filter check:", {
                mimetype: file.mimetype,
                originalname: file.originalname,
            });
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException("Only image files allowed"), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Put)("pairs/:pairId/before"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException("Only image files allowed"), false);
            }
        },
    })),
    __param(0, (0, common_1.Param)("pairId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "replaceBeforePhoto", null);
__decorate([
    (0, common_1.Put)("pairs/:pairId/after"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException("Only image files allowed"), false);
            }
        },
    })),
    __param(0, (0, common_1.Param)("pairId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "replaceAfterPhoto", null);
UploadController = __decorate([
    (0, common_1.Controller)("upload"),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard, throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [upload_service_1.UploadService,
        prisma_service_1.PrismaService,
        gallery_pairs_service_1.GalleryPairsService])
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map