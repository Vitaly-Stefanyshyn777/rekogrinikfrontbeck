import { GalleryService } from "./gallery.service";
import { AddPhotoDTO, CreateAlbumDTO, CreateBeforeAfterPairDTO, UpdateAlbumDTO, UpdatePhotoDTO } from "./gallery.dto";
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    listAlbums(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        name: string;
        slug: string;
        type: import("@prisma/client").AlbumType;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    createAlbum(dto: CreateAlbumDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        name: string;
        slug: string;
        type: import("@prisma/client").AlbumType;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updateAlbum(id: number, dto: UpdateAlbumDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        name: string;
        slug: string;
        type: import("@prisma/client").AlbumType;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    deleteAlbum(id: number): Promise<void>;
    listPhotos(albumId: number, tag?: string): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        url: string;
        publicId: string;
        title: string;
        description: string;
        tag: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    addPhoto(dto: AddPhotoDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        url: string;
        publicId: string;
        title: string;
        description: string;
        tag: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updatePhoto(id: number, dto: UpdatePhotoDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        url: string;
        publicId: string;
        title: string;
        description: string;
        tag: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    deletePhoto(id: number): Promise<void>;
    listPairs(albumId: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        beforePhotoId: number;
        afterPhotoId: number;
        label: string;
        collectionId: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    createPair(dto: CreateBeforeAfterPairDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        beforePhotoId: number;
        afterPhotoId: number;
        label: string;
        collectionId: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    createPairForAlbum(albumId: number, dto: {
        beforePhotoId: number;
        afterPhotoId: number;
        label?: string;
    }): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        albumId: number;
        beforePhotoId: number;
        afterPhotoId: number;
        label: string;
        collectionId: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    deletePair(id: number): Promise<void>;
    recreatePairs(albumId: number): Promise<void>;
    deleteCollection(albumId: number, collectionId: number, deletePhotos?: string): Promise<{
        deletedPairs: number;
        deletedPhotos: number;
    }>;
    getPairsByCollection(albumId: number, collectionId?: string): Promise<({
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
}
