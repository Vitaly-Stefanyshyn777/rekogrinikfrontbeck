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
var SQSService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSService = void 0;
const common_1 = require("@nestjs/common");
const client_sqs_1 = require("@aws-sdk/client-sqs");
let SQSService = SQSService_1 = class SQSService {
    constructor() {
        this.logger = new common_1.Logger(SQSService_1.name);
        this.indexingJobProgressQueue = 'queue_url';
        this.sqs = new client_sqs_1.SQSClient({
            region: 'us-east-1',
        });
    }
    async deleteMessage(message) {
        const deleteParams = {
            QueueUrl: this.indexingJobProgressQueue,
            ReceiptHandle: message.ReceiptHandle,
        };
        const deleteCommand = new client_sqs_1.DeleteMessageCommand(deleteParams);
        try {
            await this.sqs.send(deleteCommand);
            this.logger.log('Message deleted successfully.');
        }
        catch (err) {
            this.logger.error('Error deleting message:', err);
        }
    }
    async receiveMessages(callback) {
        const params = {
            QueueUrl: this.indexingJobProgressQueue,
            WaitTimeSeconds: 1,
        };
        const receiveCommand = new client_sqs_1.ReceiveMessageCommand(params);
        try {
            const response = await this.sqs.send(receiveCommand);
            const messages = response.Messages || [];
            if (messages.length === 0) {
                this.logger.log('No messages received.');
                return;
            }
            messages.forEach((message) => {
                this.logger.log('Received message:', message.Body);
                callback(message);
            });
        }
        catch (err) {
            this.logger.error('Error receiving messages:', err);
        }
        finally {
            await this.receiveMessages(callback);
        }
    }
};
SQSService = SQSService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SQSService);
exports.SQSService = SQSService;
//# sourceMappingURL=sqs.service.js.map