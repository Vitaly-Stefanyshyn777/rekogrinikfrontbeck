import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PublicContentController } from "./publicContent.controller";
import { PublicGalleryController } from "./publicGallery.controller";
import { PublicHeroController } from "./publicHero.controller";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";

@Module({
  imports: [PrismaModule],
  controllers: [
    PublicContentController,
    PublicGalleryController,
    PublicHeroController,
  ],
  providers: [GalleryPairsService],
})
export class PublicModule {}
