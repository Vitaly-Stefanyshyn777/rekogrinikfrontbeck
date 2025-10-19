"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAlbums = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedAlbums() {
    const albums = [
        { name: "General", slug: "general", type: client_1.AlbumType.GENERAL },
        {
            name: "Before & After",
            slug: "before-after",
            type: client_1.AlbumType.BEFORE_AFTER,
        },
    ];
    for (const album of albums) {
        await prisma.album.upsert({
            where: { slug: album.slug },
            update: album,
            create: album,
        });
    }
}
exports.seedAlbums = seedAlbums;
//# sourceMappingURL=albums.seed.js.map