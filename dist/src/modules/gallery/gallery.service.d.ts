import { PrismaService } from "../prisma/prisma.service";
import { Album, BeforeAfterPair, GalleryPhoto } from "@prisma/client";
import { AddPhotoDTO, CreateAlbumDTO, CreateBeforeAfterPairDTO, UpdateAlbumDTO, UpdatePhotoDTO } from "./gallery.dto";
import { GalleryPairsService } from "./gallery-pairs.service";
export declare class GalleryService {
    private prisma;
    private pairsService;
    constructor(prisma: PrismaService, pairsService: GalleryPairsService);
    listAlbums(): Promise<Album[]>;
    getAlbum(id: number): Promise<Album | null>;
    createAlbum(dto: CreateAlbumDTO): Promise<Album>;
    updateAlbum(id: number, dto: UpdateAlbumDTO): Promise<Album>;
    deleteAlbum(id: number): Promise<void>;
    listPhotos(albumId: number, tag?: string): Promise<GalleryPhoto[]>;
    addPhoto(dto: AddPhotoDTO): Promise<GalleryPhoto>;
    updatePhoto(id: number, dto: UpdatePhotoDTO): Promise<GalleryPhoto>;
    deletePhoto(id: number): Promise<void>;
    listPairs(albumId: number): Promise<BeforeAfterPair[]>;
    createPair(dto: CreateBeforeAfterPairDTO): Promise<BeforeAfterPair>;
    deletePair(id: number): Promise<void>;
    private ensureAlbum;
    private ensurePhoto;
    private ensurePair;
    recreatePairs(albumId: number): Promise<void>;
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
    getPairs(albumId: number): Promise<{
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
}
