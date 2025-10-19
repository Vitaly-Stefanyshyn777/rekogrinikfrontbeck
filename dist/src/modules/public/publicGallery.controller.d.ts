import { PrismaService } from "../prisma/prisma.service";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";
export declare class PublicGalleryController {
    private prisma;
    private pairsService;
    constructor(prisma: PrismaService, pairsService: GalleryPairsService);
    listAlbums(): import("@prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        name: string;
        slug: string;
        type: import("@prisma/client").AlbumType;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    getBySlug(slug: string, tag?: string): Promise<{
        album: import("@prisma/client/runtime").GetResult<{
            id: number;
            name: string;
            slug: string;
            type: import("@prisma/client").AlbumType;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        photos: (import("@prisma/client/runtime").GetResult<{
            id: number;
            albumId: number;
            url: string;
            publicId: string;
            title: string;
            description: string;
            tag: string;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
        pairs: ({
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
        }, unknown, never> & {})[];
        collections: {
            id: number;
            pairs: any;
            count: any;
        }[];
    }>;
}
