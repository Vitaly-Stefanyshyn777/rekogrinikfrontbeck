"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLOBAL_CONFIG = void 0;
const global_constants_1 = require("../shared/constants/global.constants");
exports.GLOBAL_CONFIG = {
    nest: {
        port: 3002,
    },
    cors: {
        enabled: true,
    },
    swagger: {
        enabled: true,
        title: "Nestjs Prisma Starter",
        description: "The nestjs API description",
        version: "1.5",
        path: global_constants_1.API_PREFIX,
    },
    security: {
        expiresIn: 3600 * 24,
        bcryptSaltOrRound: 10,
        jwtSecret: process.env.JWT_SECRET || "fallback-jwt-secret-key",
    },
};
//# sourceMappingURL=global.config.js.map