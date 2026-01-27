import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServerConfig, ServerConfigName } from './config/server.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serverConfig = configService.getOrThrow<ServerConfig>(ServerConfigName);
  await app.listen(serverConfig.port);
}
bootstrap();
