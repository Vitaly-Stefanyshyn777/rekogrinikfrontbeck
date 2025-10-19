import { PrismaService } from "../prisma/prisma.service";
import { CreateHeroDTO, UpdateHeroDTO } from "./hero.dto";
export declare class HeroService {
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
    createOrUpdateHero(dto: CreateHeroDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        title: string;
        subtitle: string;
        backgroundImage: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    updateHero(dto: UpdateHeroDTO): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        title: string;
        subtitle: string;
        backgroundImage: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    deleteHero(): Promise<{
        message: string;
    }>;
}
