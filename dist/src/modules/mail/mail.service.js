"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sgMail = __importStar(require("@sendgrid/mail"));
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
    }
    async sendPasswordResetCode(email, code) {
        const { SENDGRID_API_KEY, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, } = process.env;
        if (SENDGRID_API_KEY) {
            sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: SMTP_FROM || "noreply@rekogrinik.com",
                subject: "Код підтвердження для зміни паролю",
                text: `Ваш код: ${code}`,
                html: `<p>Ваш код підтвердження: <b>${code}</b></p>`,
            };
            await sgMail.send(msg);
            this.logger.log(`Reset code sent to ${email} via SendGrid`);
            return {};
        }
        let transporter;
        let fromAddress = SMTP_FROM || "RekoGrinik <no-reply@rekogrinik.local>";
        let useEthereal = false;
        if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
            transporter = nodemailer_1.default.createTransporter({
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                secure: (SMTP_SECURE || "false").toLowerCase() === "true",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });
        }
        else {
            const testAccount = await nodemailer_1.default.createTestAccount();
            transporter = nodemailer_1.default.createTransporter({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
            useEthereal = true;
            fromAddress = fromAddress || `RekoGrinik <${testAccount.user}>`;
        }
        const info = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: "Код підтвердження для зміни паролю",
            text: `Ваш код: ${code}`,
            html: `<p>Ваш код підтвердження: <b>${code}</b></p>`,
        });
        const previewUrl = useEthereal
            ? nodemailer_1.default.getTestMessageUrl(info) || undefined
            : undefined;
        this.logger.log(`Reset code sent to ${email};${previewUrl ? ` preview: ${previewUrl}` : ""}`);
        return { previewUrl };
    }
};
MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)()
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map