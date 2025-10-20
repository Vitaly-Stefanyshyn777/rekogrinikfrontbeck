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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const auth_jwt_guard_1 = require("../auth/auth.jwt.guard");
const gallery_service_1 = require("./gallery.service");
const gallery_dto_1 = require("./gallery.dto");
let GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    listAlbums() {
        return this.galleryService.listAlbums();
    }
    createAlbum(dto) {
        return this.galleryService.createAlbum(dto);
    }
    updateAlbum(id, dto) {
        return this.galleryService.updateAlbum(id, dto);
    }
    deleteAlbum(id) {
        return this.galleryService.deleteAlbum(id);
    }
    listPhotos(albumId, tag) {
        return this.galleryService.listPhotos(albumId, tag);
    }
    addPhoto(dto) {
        return this.galleryService.addPhoto(dto);
    }
    updatePhoto(id, dto) {
        return this.galleryService.updatePhoto(id, dto);
    }
    deletePhoto(id) {
        return this.galleryService.deletePhoto(id);
    }
    listPairs(albumId) {
        return this.galleryService.listPairs(albumId);
    }
    createPair(dto) {
        return this.galleryService.createPair(dto);
    }
    createPairForAlbum(albumId, dto) {
        return this.galleryService.createPair({
            albumId,
            beforePhotoId: dto.beforePhotoId,
            afterPhotoId: dto.afterPhotoId,
            label: dto.label,
        });
    }
    deletePair(id) {
        return this.galleryService.deletePair(id);
    }
    recreatePairs(albumId) {
        return this.galleryService.recreatePairs(albumId);
    }
    deleteCollection(albumId, collectionId, deletePhotos) {
        const shouldDeletePhotos = deletePhotos === "true";
        return this.galleryService.deleteCollection(albumId, collectionId, shouldDeletePhotos);
    }
    getPairsByCollection(albumId, collectionId) {
        if (collectionId) {
            return this.galleryService.getPairsByCollection(albumId, parseInt(collectionId));
        }
        return this.galleryService.getPairs(albumId);
    }
};
__decorate([
    (0, common_1.Get)("albums"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "listAlbums", null);
__decorate([
    (0, common_1.Post)("albums"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gallery_dto_1.CreateAlbumDTO]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "createAlbum", null);
__decorate([
    (0, common_1.Put)("albums/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, gallery_dto_1.UpdateAlbumDTO]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "updateAlbum", null);
__decorate([
    (0, common_1.Delete)("albums/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteAlbum", null);
__decorate([
    (0, common_1.Get)("albums/:albumId/photos"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("tag")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "listPhotos", null);
__decorate([
    (0, common_1.Post)("photos"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gallery_dto_1.AddPhotoDTO]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Put)("photos/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, gallery_dto_1.UpdatePhotoDTO]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "updatePhoto", null);
__decorate([
    (0, common_1.Delete)("photos/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Get)("albums/:albumId/pairs"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "listPairs", null);
__decorate([
    (0, common_1.Post)("pairs"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gallery_dto_1.CreateBeforeAfterPairDTO]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "createPair", null);
__decorate([
    (0, common_1.Post)("albums/:albumId/pairs"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "createPairForAlbum", null);
__decorate([
    (0, common_1.Delete)("pairs/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deletePair", null);
__decorate([
    (0, common_1.Post)("albums/:albumId/recreate-pairs"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "recreatePairs", null);
__decorate([
    (0, common_1.Delete)("albums/:albumId/collections/:collectionId"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("collectionId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("deletePhotos")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Get)("albums/:albumId/pairs"),
    __param(0, (0, common_1.Param)("albumId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("collectionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "getPairsByCollection", null);
GalleryController = __decorate([
    (0, common_1.Controller)("gallery"),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
exports.GalleryController = GalleryController;
//# sourceMappingURL=gallery.controller.js.map