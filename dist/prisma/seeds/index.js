"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_seed_1 = require("./content.seed");
const albums_seed_1 = require("./albums.seed");
async function main() {
    await (0, content_seed_1.seedContent)();
    await (0, albums_seed_1.seedAlbums)();
}
main()
    .then(() => {
    console.log("Seeds completed");
    process.exit(0);
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=index.js.map