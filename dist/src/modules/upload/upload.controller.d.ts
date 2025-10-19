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
        id: number;
        url: string;
        publicId: string;
        title: string;
    }>;
}
