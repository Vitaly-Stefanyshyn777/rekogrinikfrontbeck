import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { HeroService } from "./hero.service";
import { CreateHeroDTO, UpdateHeroDTO } from "./hero.dto";

@Controller("hero")
@UseGuards(JwtAuthGuard)
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  getHero() {
    return this.heroService.getHero();
  }

  @Post()
  createHero(@Body() dto: CreateHeroDTO) {
    return this.heroService.createOrUpdateHero(dto);
  }

  @Put()
  updateHero(@Body() dto: UpdateHeroDTO) {
    return this.heroService.updateHero(dto);
  }

  @Delete()
  deleteHero() {
    return this.heroService.deleteHero();
  }
}
