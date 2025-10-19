import { PrismaService } from "../prisma/prisma.service";
import { ContentBlock } from "@prisma/client";
import { CreateContentBlockDTO, UpdateContentBlockDTO } from "./content.dto";
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    list(): Promise<ContentBlock[]>;
    getById(id: number): Promise<ContentBlock>;
    create(dto: CreateContentBlockDTO): Promise<ContentBlock>;
    update(id: number, dto: UpdateContentBlockDTO): Promise<ContentBlock>;
    remove(id: number): Promise<void>;
}
