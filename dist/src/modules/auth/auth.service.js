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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const user_service_1 = require("../user/user.service");
const mail_service_1 = require("../mail/mail.service");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_helpers_1 = require("../../shared/helpers/auth.helpers");
const global_config_1 = require("../../configs/global.config");
let AuthService = class AuthService {
    constructor(userService, prisma, jwtService, mailService) {
        this.userService = userService;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async login(loginUserDTO) {
        const userData = await this.userService.findUser({
            email: loginUserDTO.email,
        });
        if (!userData) {
            throw new common_1.UnauthorizedException();
        }
        const isMatch = await auth_helpers_1.AuthHelpers.verify(loginUserDTO.password, userData.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException();
        }
        const payload = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: null,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: global_config_1.GLOBAL_CONFIG.security.expiresIn,
        });
        return {
            user: payload,
            accessToken: accessToken,
        };
    }
    async register(user) {
        return this.userService.createUser(user);
    }
    async requestPasswordReset(email) {
        const user = await this.userService.findUser({ email });
        if (!user) {
            return { success: true };
        }
        const token = (0, crypto_1.randomBytes)(24).toString("hex");
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, token, code, expiresAt },
        });
        const adminEmail = process.env.ADMIN_EMAIL || email;
        const res = await this.mailService.sendPasswordResetCode(adminEmail, code);
        return { success: true, previewUrl: res.previewUrl };
    }
    async resetPassword(token, newPassword) {
        const record = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!record || record.used || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException("Invalid or expired token");
        }
        await this.prisma.user.update({
            where: { id: record.userId },
            data: { password: newPassword },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { used: true },
        });
        return { success: true };
    }
    async resetPasswordWithCode(email, code, newPassword) {
        const user = await this.userService.findUser({ email });
        if (!user)
            throw new common_1.BadRequestException("Invalid code");
        const record = await this.prisma.passwordResetToken.findFirst({
            where: { userId: user.id, used: false },
            orderBy: { createdAt: "desc" },
        });
        if (!record || record.expiresAt < new Date() || record.code !== code) {
            throw new common_1.BadRequestException("Invalid or expired code");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: newPassword },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { used: true },
        });
        return { success: true };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map