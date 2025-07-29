import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
      .setTitle("My App API")
      .setDescription("NestJS Swagger auto-generated docs")
      .setVersion("1.0")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    await app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error(error);
  }
}

start();
