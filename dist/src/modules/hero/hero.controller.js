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
exports.HeroController = void 0;
const common_1 = require("@nestjs/common");
const auth_jwt_guard_1 = require("../auth/auth.jwt.guard");
const hero_service_1 = require("./hero.service");
const hero_dto_1 = require("./hero.dto");
let HeroController = class HeroController {
    constructor(heroService) {
        this.heroService = heroService;
    }
    getHero() {
        return this.heroService.getHero();
    }
    createHero(dto) {
        return this.heroService.createOrUpdateHero(dto);
    }
    updateHero(dto) {
        return this.heroService.updateHero(dto);
    }
    deleteHero() {
        return this.heroService.deleteHero();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HeroController.prototype, "getHero", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hero_dto_1.CreateHeroDTO]),
    __metadata("design:returntype", void 0)
], HeroController.prototype, "createHero", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hero_dto_1.UpdateHeroDTO]),
    __metadata("design:returntype", void 0)
], HeroController.prototype, "updateHero", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HeroController.prototype, "deleteHero", null);
HeroController = __decorate([
    (0, common_1.Controller)("hero"),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], HeroController);
exports.HeroController = HeroController;
//# sourceMappingURL=hero.controller.js.map