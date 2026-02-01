import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PublicContentController } from "./publicContent.controller";
import { PublicGalleryController } from "./publicGallery.controller";
import {
  PublicHeroController,
  PublicHeroControllerCompat,
} from "./publicHero.controller";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";
import { PublicFormController } from "./publicForm.controller";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
  imports: [PrismaModule, TelegramModule],
  controllers: [
    PublicContentController,
    PublicGalleryController,
    PublicHeroController,
    PublicHeroControllerCompat,
    PublicFormController,
  ],
  providers: [GalleryPairsService],
})
export class PublicModule {}
