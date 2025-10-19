import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GalleryPairsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Автоматично створює пари "До/Після" коли є 3+3 фото
   */
  async createPairsAutomatically(albumId: number): Promise<void> {
    // Отримати всі фото з альбому
    const photos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
      orderBy: { createdAt: "asc" },
    });

    // Розділити на "До" та "Після" за мітками
    const beforePhotos = photos.filter((photo) => photo.tag === "before");

    const afterPhotos = photos.filter((photo) => photo.tag === "after");

    console.log(
      `Found ${beforePhotos.length} "До" photos and ${afterPhotos.length} "Після" photos`
    );

    // Перевірити чи є мінімум 3 фото кожного типу
    if (beforePhotos.length < 3 || afterPhotos.length < 3) {
      console.log("Not enough photos to create pairs (need 3+3)");
      return;
    }

    // Видалити існуючі пари для цього альбому
    await this.prisma.beforeAfterPair.deleteMany({
      where: { albumId },
    });

    // Створити колекції по 3+3 фото
    const collectionsToCreate = [];
    const maxCollections = Math.min(
      Math.floor(beforePhotos.length / 3),
      Math.floor(afterPhotos.length / 3)
    );

    for (let collectionId = 1; collectionId <= maxCollections; collectionId++) {
      const startBefore = (collectionId - 1) * 3;
      const startAfter = (collectionId - 1) * 3;

      // Створити 3 пари для кожної колекції
      for (let i = 0; i < 3; i++) {
        const beforePhoto = beforePhotos[startBefore + i];
        const afterPhoto = afterPhotos[startAfter + i];

        if (beforePhoto && afterPhoto) {
          collectionsToCreate.push({
            albumId,
            beforePhotoId: beforePhoto.id,
            afterPhotoId: afterPhoto.id,
            label: `Колекція ${collectionId} - Пара ${i + 1}`,
            collectionId: collectionId,
          });
        }
      }
    }

    if (collectionsToCreate.length > 0) {
      await this.prisma.beforeAfterPair.createMany({
        data: collectionsToCreate,
      });

      console.log(
        `Created ${collectionsToCreate.length} pairs in ${maxCollections} collections automatically`
      );
    }
  }

  /**
   * Отримати пари з повною інформацією про фото
   */
  async getPairsWithPhotos(albumId: number) {
    return this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      include: {
        beforePhoto: true,
        afterPhoto: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Отримати колекції (групи по 3 пари)
   */
  async getCollections(albumId: number) {
    const pairs = await this.getPairsWithPhotos(albumId);

    // Групувати пари за collectionId
    const collections = {};
    pairs.forEach((pair) => {
      const collectionId = pair.collectionId || 1;
      if (!collections[collectionId]) {
        collections[collectionId] = [];
      }
      collections[collectionId].push(pair);
    });

    // Конвертувати в масив колекцій
    return Object.keys(collections).map((collectionId) => ({
      id: parseInt(collectionId),
      pairs: collections[collectionId],
      count: collections[collectionId].length,
    }));
  }

  /**
   * Перевірити чи можна створити пари
   */
  async canCreatePairs(albumId: number): Promise<boolean> {
    const photos = await this.prisma.galleryPhoto.findMany({
      where: { albumId },
    });

    const beforeCount = photos.filter((photo) => photo.tag === "before").length;

    const afterCount = photos.filter((photo) => photo.tag === "after").length;

    return beforeCount >= 3 && afterCount >= 3;
  }
}
