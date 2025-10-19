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
exports.PublicGalleryController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gallery_pairs_service_1 = require("../gallery/gallery-pairs.service");
let PublicGalleryController = class PublicGalleryController {
    constructor(prisma, pairsService) {
        this.prisma = prisma;
        this.pairsService = pairsService;
    }
    listAlbums() {
        return this.prisma.album.findMany({ orderBy: { createdAt: "desc" } });
    }
    async getBySlug(slug, tag) {
        const album = await this.prisma.album.findUnique({ where: { slug } });
        if (!album)
            return null;
        const where = { albumId: album.id };
        if (tag) {
            where.tag = tag;
        }
        const photos = await this.prisma.galleryPhoto.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        const pairs = await this.pairsService.getPairsWithPhotos(album.id);
        const collections = await this.pairsService.getCollections(album.id);
        return { album, photos, pairs, collections };
    }
};
__decorate([
    (0, common_1.Get)("albums"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicGalleryController.prototype, "listAlbums", null);
__decorate([
    (0, common_1.Get)("albums/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Query)("tag")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicGalleryController.prototype, "getBySlug", null);
PublicGalleryController = __decorate([
    (0, common_1.Controller)("public/gallery"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gallery_pairs_service_1.GalleryPairsService])
], PublicGalleryController);
exports.PublicGalleryController = PublicGalleryController;
//# sourceMappingURL=publicGallery.controller.js.map