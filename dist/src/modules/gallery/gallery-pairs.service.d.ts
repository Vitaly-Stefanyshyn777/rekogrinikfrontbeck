import { PrismaService } from "../prisma/prisma.service";
export declare class GalleryPairsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPairsAutomatically(albumId: number): Promise<void>;
    getPairsWithPhotos(albumId: number): Promise<{
        beforePhoto: import("@prisma/client/runtime").GetResult<{
            id: number;
            albumId: number;
            url: string;
            publicId: string;
            title: string;
            description: string;
            tag: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        afterPhoto: import("@prisma/client/runtime").GetResult<{
            id: number;
            albumId: number;
            url: string;
            publicId: string;
            title: string;
            description: string;
            tag: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        createdAt: Date;
        updatedAt: Date;
        albumId: number;
        beforePhotoId: number;
        afterPhotoId: number;
        label: string;
        collectionId: number;
        key: number;
    }[]>;
    getCollections(albumId: number): Promise<{
        key: number;
        pairs: any;
        count: any;
    }[]>;
    canCreatePairs(albumId: number): Promise<boolean>;
    deleteCollection(albumId: number, collectionId: number, deletePhotos?: boolean): Promise<{
        deletedPairs: number;
        deletedPhotos: number;
    }>;
    getPairsByCollection(albumId: number, collectionId: number): Promise<({
        beforePhoto: import("@prisma/client/runtime").GetResult<{
            id: number;
            albumId: number;
            url: string;
            publicId: string;
            title: string;
            description: string;
            tag: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        afterPhoto: import("@prisma/client/runtime").GetResult<{
            id: number;
            albumId: number;
            url: string;
            publicId: string;
            title: string;
            description: string;
            tag: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        beforePhotoId: number;
        afterPhotoId: number;
        label: string;
        collectionId: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    replaceBeforePhoto(pairId: number, newPhotoId: number): Promise<any>;
    replaceAfterPhoto(pairId: number, newPhotoId: number): Promise<any>;
    cleanupOrphanedPhotos(albumId: number): Promise<number>;
}
