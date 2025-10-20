"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
    }
    async sendPasswordResetCode(email, code) {
        this.logger.warn("🚫 PASSWORD RESET DISABLED - SMTP not configured");
        this.logger.warn("📧 To enable password reset, configure SMTP or SendGrid in .env");
        this.logger.warn(`🔑 Generated code for ${email}: ${code}`);
        return { previewUrl: undefined };
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)()
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map