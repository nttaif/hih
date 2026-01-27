import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './config/server.config';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { WinstonLogger } from './config/winston.logger';

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