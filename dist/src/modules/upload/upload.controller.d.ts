/// <reference types="multer" />
import { UploadService } from "./upload.service";
import { PrismaService } from "../prisma/prisma.service";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";
export declare class UploadController {
    private readonly uploadService;
    private readonly prisma;
    private readonly pairsService;
    constructor(uploadService: UploadService, prisma: PrismaService, pairsService: GalleryPairsService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadPhoto(file: Express.Multer.File, body: {
        albumId: number;
        title?: string;
        description?: string;
        tag?: string;
    }): Promise<{
        id: any;
        url: string;
        publicId: string;
        title: any;
    }>;
    replaceBeforePhoto(pairId: number, file: Express.Multer.File, body: {
        title?: string;
        description?: string;
        deleteOld?: string;
    }): Promise<{
        pairId: any;
        beforePhoto: {
            id: any;
            url: any;
            publicId: any;
            title: any;
        };
    }>;
    replaceAfterPhoto(pairId: number, file: Express.Multer.File, body: {
        title?: string;
        description?: string;
        deleteOld?: string;
    }): Promise<{
        pairId: any;
        afterPhoto: {
            id: any;
            url: any;
            publicId: any;
            title: any;
        };
    }>;
}
