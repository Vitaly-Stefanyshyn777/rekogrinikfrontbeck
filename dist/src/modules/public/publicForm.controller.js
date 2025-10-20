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
exports.PublicFormController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const publicForm_dto_1 = require("./publicForm.dto");
let PublicFormController = class PublicFormController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(dto, userAgent, ip) {
        var _a;
        const created = await this.prisma.formSubmission.create({
            data: {
                name: dto.name,
                phone: dto.phone,
                email: dto.email,
                workType: dto.workType,
                message: dto.message,
                consent: dto.consent,
                address: dto.address,
                contactTime: dto.contactTime,
                source: dto.source ? dto.source : undefined,
                files: dto.files ? dto.files : undefined,
                locale: (_a = dto.locale) !== null && _a !== void 0 ? _a : "uk",
                userAgent,
                ip,
            },
        });
        return { id: created.id, createdAt: created.createdAt };
    }
    async list(limit = 20) {
        const take = Math.min(Number(limit) || 20, 100);
        const rows = await this.prisma.formSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take,
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                workType: true,
                message: true,
                consent: true,
                address: true,
                contactTime: true,
                source: true,
                files: true,
                locale: true,
                createdAt: true,
            },
        });
        return rows;
    }
    async getById(id) {
        const row = await this.prisma.formSubmission.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                workType: true,
                message: true,
                consent: true,
                address: true,
                contactTime: true,
                source: true,
                files: true,
                locale: true,
                createdAt: true,
            },
        });
        return row !== null && row !== void 0 ? row : null;
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ description: "Form submission stored" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("user-agent")),
    __param(2, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publicForm_dto_1.PublicFormDTO, String, String]),
    __metadata("design:returntype", Promise)
], PublicFormController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: "List form submissions" }),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicFormController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOkResponse)({ description: "Get form submission by id" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicFormController.prototype, "getById", null);
PublicFormController = __decorate([
    (0, swagger_1.ApiTags)("public/form"),
    (0, common_1.Controller)("public/form"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicFormController);
exports.PublicFormController = PublicFormController;
//# sourceMappingURL=publicForm.controller.js.map