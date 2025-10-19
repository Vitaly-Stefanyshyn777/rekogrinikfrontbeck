import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
      const photo = await this.prisma.galleryPhoto.create({
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
      const album = await this.prisma.album.findUnique({
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
}
