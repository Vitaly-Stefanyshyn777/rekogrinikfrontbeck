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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        return this.prisma.contentBlock.findMany({
            orderBy: { blockNumber: "asc" },
        });
    }
    async getById(id) {
        const block = await this.prisma.contentBlock.findUnique({ where: { id } });
        if (!block)
            throw new common_1.NotFoundException("Content block not found");
        return block;
    }
    async create(dto) {
        return this.prisma.contentBlock.create({ data: dto });
    }
    async update(id, dto) {
        await this.getById(id);
        return this.prisma.contentBlock.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.getById(id);
        await this.prisma.contentBlock.delete({ where: { id } });
    }
};
ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
exports.ContentService = ContentService;
//# sourceMappingURL=content.service.js.map