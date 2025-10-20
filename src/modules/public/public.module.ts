import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PublicContentController } from "./publicContent.controller";
import { PublicGalleryController } from "./publicGallery.controller";
import { PublicHeroController } from "./publicHero.controller";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";
import { PublicFormController } from "./publicForm.controller";

@Module({
  imports: [PrismaModule],
  controllers: [
    PublicContentController,
    PublicGalleryController,
    PublicHeroController,
    PublicFormController,
  ],
  providers: [GalleryPairsService],
})
export class PublicModule {}
