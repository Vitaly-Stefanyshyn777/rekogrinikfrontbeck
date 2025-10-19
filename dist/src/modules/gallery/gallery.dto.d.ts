import { AlbumType } from "@prisma/client";
export declare class CreateAlbumDTO {
    name: string;
    slug: string;
    type: AlbumType;
}
export declare class UpdateAlbumDTO {
    name?: string;
    slug?: string;
    type?: AlbumType;
}
export declare class AddPhotoDTO {
    albumId: number;
    url: string;
    title?: string;
    description?: string;
    tag?: string;
}
export declare class UpdatePhotoDTO {
    url?: string;
    title?: string;
    description?: string;
    tag?: string;
}
export declare class CreateBeforeAfterPairDTO {
    albumId: number;
    beforePhotoId: number;
    afterPhotoId: number;
    label?: string;
}
