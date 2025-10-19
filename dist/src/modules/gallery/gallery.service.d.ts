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
}
