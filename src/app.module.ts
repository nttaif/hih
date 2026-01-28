import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import serverConfig from './config/server.config';
import databaseConfig, { DatabaseConfigName } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { WinstonLogger } from './config/winston.logger';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        serverConfig,
        databaseConfig
      ],
      cache: true,
      envFilePath: getEnvFilePath(),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow(DatabaseConfigName),
    }),
    UserModule
  ],
  providers: [
    {
      provide: 'Logger',
      useClass: WinstonLogger,
    },
  ],
})
export class AppModule {}


function getEnvFilePath() {
  return process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
}