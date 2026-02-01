import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppModule } from "./modules/app/app.module";
import { API_PREFIX } from "./shared/constants/global.constants";
import { SwaggerConfig } from "./configs/config.interface";
import { GLOBAL_CONFIG } from "./configs/global.config";
import { MyLogger } from "./modules/logger/logger.service";
import { InvalidFormExceptionFilter } from "./filters/invalid.form.exception.filter";
import { AllExceptionsFilter } from "./filters/all.exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "error", "warn"],
  });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost)),
    new InvalidFormExceptionFilter()
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        // Логування для діагностики
        console.log("CORS request from origin:", origin);

        // Дозволяємо запити без origin (наприклад, Postman, мобільні додатки)
        if (!origin) {
          console.log("CORS: Allowing request without origin");
          return callback(null, true);
        }

        // Список дозволених доменів
        const allowedDomains = [
          "https://rekogrinik.cz",
          "https://www.rekogrinik.cz",
          process.env.FRONTEND_URL,
          "https://rekogrinikadmin-production.up.railway.app",
          "https://rekogrinikfront-production.up.railway.app",
          "https://rekogrinikfront-production-7069.up.railway.app",
          "https://rekogrinikadmin-production-cf18.up.railway.app",
        ].filter(Boolean); // Видаляємо undefined значення

        // Перевірка точного співпадіння
        if (allowedDomains.includes(origin)) {
          console.log("CORS: Allowing exact match:", origin);
          return callback(null, true);
        }

        // Перевірка localhost
        if (
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:")
        ) {
          console.log("CORS: Allowing localhost:", origin);
          return callback(null, true);
        }

        // Перевірка починається з дозволеного домену
        const isAllowed = allowedDomains.some((domain) =>
          origin.startsWith(domain)
        );

        if (isAllowed) {
          console.log("CORS: Allowing domain match:", origin);
          callback(null, true);
        } else {
          console.log("CORS: Blocking origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
      exposedHeaders: ["Content-Length", "Content-Type"],
    })
  );

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || "Nestjs")
      .setDescription(swaggerConfig.description || "The nestjs API description")
      .setVersion(swaggerConfig.version || "1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || "api", app, document);
  }

  const PORT = process.env.PORT || GLOBAL_CONFIG.nest.port;
  await app.listen(PORT, async () => {
    const myLogger = await app.resolve(MyLogger);
    myLogger.log(`Server started listening: ${PORT}`);
  });
}
bootstrap();

