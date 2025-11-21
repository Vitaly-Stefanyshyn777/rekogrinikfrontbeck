import { ConfigService } from "@nestjs/config";
import { FormSubmission } from "@prisma/client";
export declare class TelegramService {
    private readonly configService;
    private readonly logger;
    private readonly botToken?;
    private readonly chatId?;
    constructor(configService: ConfigService);
    sendMessage(text: string): Promise<void>;
    notifyNewFormSubmission(submission: FormSubmission, meta?: {
        ip?: string;
        userAgent?: string;
    }): Promise<void>;
    private buildFormMessage;
}
