export declare class SQSService {
    private readonly logger;
    private sqs;
    private indexingJobProgressQueue;
    constructor();
    deleteMessage(message: any): Promise<void>;
    receiveMessages(callback: any): Promise<void>;
}
