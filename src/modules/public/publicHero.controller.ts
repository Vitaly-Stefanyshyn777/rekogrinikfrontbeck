import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public/hero")
export class PublicHeroController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHero() {
    try {
      const hero = await this.prisma.hero.findFirst();
      return hero;
    } catch (error) {
      console.error("Hero fetch error:", error);
      return null;
    }
  }
}

// Додатковий контролер для сумісності з фронтендом (без префіксу public)
@Controller("hero")
export class PublicHeroControllerCompat {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHero() {
    try {
      const hero = await this.prisma.hero.findFirst();
      return hero;
    } catch (error) {
      console.error("Hero fetch error:", error);
      return null;
    }
  }
}
