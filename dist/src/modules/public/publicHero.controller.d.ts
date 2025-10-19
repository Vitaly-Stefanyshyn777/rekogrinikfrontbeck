import { PrismaService } from "../prisma/prisma.service";
export declare class PublicHeroController {
    private prisma;
    constructor(prisma: PrismaService);
    getHero(): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        title: string;
        subtitle: string;
        backgroundImage: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
