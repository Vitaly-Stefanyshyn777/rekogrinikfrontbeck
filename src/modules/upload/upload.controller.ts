import {
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Body,
  UploadedFiles,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ThrottlerGuard } from "@nestjs/throttler";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { UploadService } from "./upload.service";
import { PrismaService } from "../prisma/prisma.service";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";

@Controller("upload")
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
    private readonly pairsService: GalleryPairsService
  ) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        console.log("File filter check:", {
          mimetype: file.mimetype,
          originalname: file.originalname,
        });
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image files allowed"), false);
        }
      },
    })
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log("Upload request received:", {
      file: file
        ? {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          }
        : null,
    });

    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik"
      );
      console.log("Upload successful:", { url, publicId });
      return { url, publicId };
    } catch (error) {
      console.error("Upload error:", error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post("photo")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        console.log("File filter check:", {
          mimetype: file.mimetype,
          originalname: file.originalname,
        });
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image files allowed"), false);
        }
      },
    })
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      albumId: number;
      title?: string;
      description?: string;
      tag?: string;
    }
  ) {
    console.log("Upload photo request:", {
      file: file ? { originalname: file.originalname, size: file.size } : null,
      body,
    });

    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    // Валідація albumId
    const albumId = parseInt(body.albumId.toString());
    if (isNaN(albumId) || albumId <= 0) {
      throw new BadRequestException("Invalid albumId");
    }

    try {
      // 1. Завантажити в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik"
      );

      // 2. Зберегти в БД
      const photo = await (this.prisma as any).galleryPhoto.create({
        data: {
          albumId: albumId,
          url: url,
          publicId: publicId,
          title: body.title,
          description: body.description,
          tag: body.tag, // 🏷️ Зберегти мітку
        },
      });

      // 3. Автоматично створити пари для альбому "До/Після"
      const album = await (this.prisma as any).album.findUnique({
        where: { id: albumId },
      });
      if (album?.type === "BEFORE_AFTER") {
        await this.pairsService.createPairsAutomatically(albumId);
        console.log("Auto-created pairs for BEFORE_AFTER album");
      }

      console.log("Photo saved successfully:", { id: photo.id, url });
      return { id: photo.id, url, publicId, title: photo.title };
    } catch (error) {
      console.error("Upload photo error:", error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Put("pairs/:pairId/before")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image files allowed"), false);
        }
      },
    })
  )
  async replaceBeforePhoto(
    @Param("pairId", ParseIntPipe) pairId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title?: string; description?: string; deleteOld?: string }
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // 1. Завантажити нове фото в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik"
      );

      // 2. Отримати пару спочатку
      const pair = await (this.prisma as any).beforeAfterPair.findUnique({
        where: { id: pairId },
        include: { album: true, beforePhoto: true },
      });

      if (!pair) {
        throw new BadRequestException("Pair not found");
      }

      // 3. Створити новий запис фото з правильним albumId
      const newPhoto = await (this.prisma as any).galleryPhoto.create({
        data: {
          albumId: pair.albumId, // Правильний albumId зразу
          url: url,
          publicId: publicId,
          title: body.title,
          description: body.description,
          tag: "before",
        },
      });

      // 4. Замінити фото в парі
      const updatedPair = await this.pairsService.replaceBeforePhoto(
        pairId,
        newPhoto.id
      );

      // 5. Видалити старе фото якщо потрібно
      if (body.deleteOld === "true" && pair.beforePhoto) {
        const oldPhoto = pair.beforePhoto;

        // Перевірити чи старе фото використовується в інших парах
        const otherPairs = await (this.prisma as any).beforeAfterPair.findMany({
          where: {
            OR: [{ beforePhotoId: oldPhoto.id }, { afterPhotoId: oldPhoto.id }],
          },
        });

        if (otherPairs.length === 0) {
          // Видалити з Cloudinary
          if (oldPhoto.publicId) {
            await this.uploadService.deleteImage(oldPhoto.publicId);
          }

          // Видалити з БД
          await (this.prisma as any).galleryPhoto.delete({
            where: { id: oldPhoto.id },
          });
        }
      }

      return {
        pairId: updatedPair.id,
        beforePhoto: {
          id: newPhoto.id,
          url: newPhoto.url,
          publicId: newPhoto.publicId,
          title: newPhoto.title,
        },
      };
    } catch (error) {
      console.error("Replace before photo error:", error);
      throw new BadRequestException(`Replace failed: ${error.message}`);
    }
  }

  @Put("pairs/:pairId/after")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image files allowed"), false);
        }
      },
    })
  )
  async replaceAfterPhoto(
    @Param("pairId", ParseIntPipe) pairId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title?: string; description?: string; deleteOld?: string }
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // 1. Завантажити нове фото в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik"
      );

      // 2. Отримати пару спочатку
      const pair = await (this.prisma as any).beforeAfterPair.findUnique({
        where: { id: pairId },
        include: { album: true, afterPhoto: true },
      });

      if (!pair) {
        throw new BadRequestException("Pair not found");
      }

      // 3. Створити новий запис фото з правильним albumId
      const newPhoto = await (this.prisma as any).galleryPhoto.create({
        data: {
          albumId: pair.albumId, // Правильний albumId зразу
          url: url,
          publicId: publicId,
          title: body.title,
          description: body.description,
          tag: "after",
        },
      });

      // 4. Замінити фото в парі
      const updatedPair = await this.pairsService.replaceAfterPhoto(
        pairId,
        newPhoto.id
      );

      // 5. Видалити старе фото якщо потрібно
      if (body.deleteOld === "true" && pair.afterPhoto) {
        const oldPhoto = pair.afterPhoto;

        // Перевірити чи старе фото використовується в інших парах
        const otherPairs = await (this.prisma as any).beforeAfterPair.findMany({
          where: {
            OR: [{ beforePhotoId: oldPhoto.id }, { afterPhotoId: oldPhoto.id }],
          },
        });

        if (otherPairs.length === 0) {
          // Видалити з Cloudinary
          if (oldPhoto.publicId) {
            await this.uploadService.deleteImage(oldPhoto.publicId);
          }

          // Видалити з БД
          await (this.prisma as any).galleryPhoto.delete({
            where: { id: oldPhoto.id },
          });
        }
      }

      return {
        pairId: updatedPair.id,
        afterPhoto: {
          id: newPhoto.id,
          url: newPhoto.url,
          publicId: newPhoto.publicId,
          title: newPhoto.title,
        },
      };
    } catch (error) {
      console.error("Replace after photo error:", error);
      throw new BadRequestException(`Replace failed: ${error.message}`);
    }
  }
}
