import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { HeroService } from "./hero.service";
import { HeroController } from "./hero.controller";

@Module({
  imports: [PrismaModule],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}


