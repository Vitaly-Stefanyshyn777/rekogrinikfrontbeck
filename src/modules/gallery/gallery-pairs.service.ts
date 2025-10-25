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

    // НЕ видаляти існуючі пари - додавати нові
    // await this.prisma.beforeAfterPair.deleteMany({
    //   where: { albumId },
    // });

    // Отримати існуючі пари, щоб не створювати дублікати
    const existingPairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      select: { beforePhotoId: true, afterPhotoId: true, collectionId: true },
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
          // Перевірити чи пара вже існує
          const pairExists = existingPairs.some(
            (pair) =>
              pair.beforePhotoId === beforePhoto.id &&
              pair.afterPhotoId === afterPhoto.id &&
              pair.collectionId === collectionId
          );

          if (!pairExists) {
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
    const pairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      include: {
        beforePhoto: true,
        afterPhoto: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Трансформувати id в key для фронтенду
    return pairs.map((pair) => {
      const { id, ...rest } = pair;
      return { key: id, ...rest };
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
      key: parseInt(collectionId),
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

  /**
   * Видалити всю колекцію (3 пари "До і Після")
   */
  async deleteCollection(
    albumId: number,
    collectionId: number,
    deletePhotos: boolean = true
  ): Promise<{ deletedPairs: number; deletedPhotos: number }> {
    // Знайти всі пари цієї колекції
    const pairs = await this.prisma.beforeAfterPair.findMany({
      where: { albumId, collectionId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    if (pairs.length === 0) {
      return { deletedPairs: 0, deletedPhotos: 0 };
    }

    // Видалити пари
    await this.prisma.beforeAfterPair.deleteMany({
      where: { albumId, collectionId },
    });

    let deletedPhotos = 0;

    if (deletePhotos) {
      // Зібрати всі унікальні фото ID
      const photoIds = new Set<number>();
      pairs.forEach((pair) => {
        photoIds.add(pair.beforePhotoId);
        photoIds.add(pair.afterPhotoId);
      });

      // Перевірити чи фото використовуються в інших парах
      for (const photoId of photoIds) {
        const otherPairs = await this.prisma.beforeAfterPair.findMany({
          where: {
            OR: [{ beforePhotoId: photoId }, { afterPhotoId: photoId }],
          },
        });

        // Якщо фото не використовується в інших парах - видалити
        if (otherPairs.length === 0) {
          const photo = await this.prisma.galleryPhoto.findUnique({
            where: { id: photoId },
          });

          if (photo) {
            // Видалити з Cloudinary (якщо є publicId)
            if (photo.publicId) {
              try {
                // Тут потрібно буде додати UploadService для видалення з Cloudinary
                console.log(`Would delete from Cloudinary: ${photo.publicId}`);
              } catch (error) {
                console.error(
                  `Failed to delete from Cloudinary: ${photo.publicId}`,
                  error
                );
              }
            }

            // Видалити з БД
            await this.prisma.galleryPhoto.delete({
              where: { id: photoId },
            });

            deletedPhotos++;
          }
        }
      }
    }

    return { deletedPairs: pairs.length, deletedPhotos };
  }

  /**
   * Отримати пари конкретної колекції
   */
  async getPairsByCollection(albumId: number, collectionId: number) {
    return this.prisma.beforeAfterPair.findMany({
      where: { albumId, collectionId },
      include: {
        beforePhoto: true,
        afterPhoto: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Замінити фото "До" в парі
   */
  async replaceBeforePhoto(pairId: number, newPhotoId: number): Promise<any> {
    const pair = await this.prisma.beforeAfterPair.findUnique({
      where: { id: pairId },
      include: { beforePhoto: true },
    });

    if (!pair) {
      throw new Error("Pair not found");
    }

    // Оновити пару з новим фото
    const updatedPair = await this.prisma.beforeAfterPair.update({
      where: { id: pairId },
      data: { beforePhotoId: newPhotoId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    return updatedPair;
  }

  /**
   * Замінити фото "Після" в парі
   */
  async replaceAfterPhoto(pairId: number, newPhotoId: number): Promise<any> {
    const pair = await this.prisma.beforeAfterPair.findUnique({
      where: { id: pairId },
      include: { afterPhoto: true },
    });

    if (!pair) {
      throw new Error("Pair not found");
    }

    // Оновити пару з новим фото
    const updatedPair = await this.prisma.beforeAfterPair.update({
      where: { id: pairId },
      data: { afterPhotoId: newPhotoId },
      include: { beforePhoto: true, afterPhoto: true },
    });

    return updatedPair;
  }
}
