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
exports.HeroService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HeroService = class HeroService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHero() {
        return this.prisma.hero.findFirst();
    }
    async createOrUpdateHero(dto) {
        await this.prisma.hero.deleteMany();
        return this.prisma.hero.create({
            data: dto,
        });
    }
    async updateHero(dto) {
        const hero = await this.prisma.hero.findFirst();
        if (!hero) {
            throw new common_1.NotFoundException("Hero not found");
        }
        return this.prisma.hero.update({
            where: { id: hero.id },
            data: dto,
        });
    }
    async deleteHero() {
        await this.prisma.hero.deleteMany();
        return { message: "Hero deleted successfully" };
    }
};
HeroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HeroService);
exports.HeroService = HeroService;
//# sourceMappingURL=hero.service.js.map