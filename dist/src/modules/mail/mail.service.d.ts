export declare class MailService {
    private readonly logger;
    sendPasswordResetCode(email: string, code: string): Promise<{
        previewUrl?: string;
    }>;
}
