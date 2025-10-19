import { ContentService } from "./content.service";
import { CreateContentBlockDTO, UpdateContentBlockDTO } from "./content.dto";
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    list(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        blockNumber: number;
        name: string;
        text: string;
        imageUrl: string;
        imagePublicId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    getById(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        blockNumber: number;
        name: string;
        text: string;
        imageUrl: string;
        imagePublicId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    create(dto: CreateContentBlockDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        blockNumber: number;
        name: string;
        text: string;
        imageUrl: string;
        imagePublicId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    update(id: number, dto: UpdateContentBlockDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        blockNumber: number;
        name: string;
        text: string;
        imageUrl: string;
        imagePublicId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(id: number): Promise<void>;
}
