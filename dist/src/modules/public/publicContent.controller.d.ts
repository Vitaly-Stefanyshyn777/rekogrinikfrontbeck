import { PrismaService } from "../prisma/prisma.service";
export declare class PublicContentController {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import("@prisma/client").Prisma.PrismaPromise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        blockNumber: number;
        name: string;
        text: string;
        imageUrl: string;
        imagePublicId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
}
