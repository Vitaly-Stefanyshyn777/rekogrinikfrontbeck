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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.botToken = this.configService.get("TELEGRAM_BOT_TOKEN");
        this.chatId = this.configService.get("TELEGRAM_CHAT_ID");
    }
    async sendMessage(text) {
        if (!this.botToken || !this.chatId) {
            this.logger.warn("Telegram credentials are not configured. Skipping notification.");
            return;
        }
        const apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text,
                    parse_mode: "HTML",
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Failed to send Telegram message: ${response.status} ${errorText}`);
            }
        }
        catch (error) {
            this.logger.error("Telegram message sending failed", error);
        }
    }
    async notifyNewFormSubmission(submission, meta) {
        const message = this.buildFormMessage(submission, meta);
        await this.sendMessage(message);
    }
    buildFormMessage(submission, meta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const lines = [
            "📩 <b>Нова заявка з сайту</b>",
            "",
            `<b>Ім'я:</b> ${(_a = submission.name) !== null && _a !== void 0 ? _a : "—"}`,
            `<b>Телефон:</b> ${(_b = submission.phone) !== null && _b !== void 0 ? _b : "—"}`,
            `<b>Email:</b> ${(_c = submission.email) !== null && _c !== void 0 ? _c : "—"}`,
            `<b>Тип робіт:</b> ${(_d = submission.workType) !== null && _d !== void 0 ? _d : "—"}`,
            `<b>Адреса:</b> ${(_e = submission.address) !== null && _e !== void 0 ? _e : "—"}`,
            `<b>Час зв'язку:</b> ${(_f = submission.contactTime) !== null && _f !== void 0 ? _f : "—"}`,
            `<b>Повідомлення:</b>\n${(_g = submission.message) !== null && _g !== void 0 ? _g : "—"}`,
            "",
            `<b>Згода на обробку:</b> ${submission.consent ? "✅" : "❌"}`,
            `<b>Мова:</b> ${(_h = submission.locale) !== null && _h !== void 0 ? _h : "—"}`,
            `<b>Джерело:</b> ${submission.source ? JSON.stringify(submission.source) : "—"}`,
            `<b>Файли:</b> ${submission.files ? JSON.stringify(submission.files) : "—"}`,
            `<b>Створено:</b> ${submission.createdAt.toISOString()}`,
        ];
        if ((meta === null || meta === void 0 ? void 0 : meta.ip) || (meta === null || meta === void 0 ? void 0 : meta.userAgent)) {
            lines.push("", `<b>IP:</b> ${(_j = meta.ip) !== null && _j !== void 0 ? _j : "—"}`, `<b>User-Agent:</b> ${(_k = meta.userAgent) !== null && _k !== void 0 ? _k : "—"}`);
        }
        return lines.join("\n");
    }
};
TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
exports.TelegramService = TelegramService;
//# sourceMappingURL=telegram.service.js.map