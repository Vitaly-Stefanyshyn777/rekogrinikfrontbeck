/// <reference types="node" />
/// <reference types="node" />
export declare class UploadService {
    constructor();
    uploadImage(buffer: Buffer, folder: string): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string): Promise<void>;
}
