import { seedContent } from "./seeds/content.seed";
import { seedAlbums } from "./seeds/albums.seed";

async function main() {
  await seedContent();
  await seedAlbums();
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Prisma seeds completed");
    process.exit(0);
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });


