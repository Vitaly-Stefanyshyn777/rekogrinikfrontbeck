"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const user_module_1 = require("../user/user.module");
const post_module_1 = require("../post/post.module");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
const global_config_1 = require("../../configs/global.config");
const logger_module_1 = require("../logger/logger.module");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const logger_middleware_1 = require("../../middlewares/logger.middleware");
const content_module_1 = require("../content/content.module");
const gallery_module_1 = require("../gallery/gallery.module");
const public_module_1 = require("../public/public.module");
const upload_module_1 = require("../upload/upload.module");
const hero_module_1 = require("../hero/hero.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logger_module_1.LoggerModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            post_module_1.PostModule,
            content_module_1.ContentModule,
            gallery_module_1.GalleryModule,
            public_module_1.PublicModule,
            upload_module_1.UploadModule,
            hero_module_1.HeroModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [() => global_config_1.GLOBAL_CONFIG],
                envFilePath: ".env",
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map