"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRISMA_CLIENT_OPTIONS = exports.PRISMA_LOG_CONFIG = void 0;
exports.PRISMA_LOG_CONFIG = [
    { level: "warn", emit: "stdout" },
    { level: "info", emit: "stdout" },
    { level: "error", emit: "stdout" },
    { level: "query", emit: "stdout" },
];
exports.PRISMA_CLIENT_OPTIONS = {
    log: exports.PRISMA_LOG_CONFIG,
    rejectOnNotFound: true,
};
//# sourceMappingURL=prisma.config.js.map