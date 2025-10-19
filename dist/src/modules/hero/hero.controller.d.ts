import { HeroService } from "./hero.service";
import { CreateHeroDTO, UpdateHeroDTO } from "./hero.dto";
export declare class HeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    getHero(): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        title: string;
        subtitle: string;
        backgroundImage: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    createHero(dto: CreateHeroDTO): Promise<import("@prisma/client/runtime").GetResult<{
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
