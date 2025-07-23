import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './modules/books/books.controller';
import serverConfig from './config/server.config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load : [serverConfig],
    }),

    RedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService): RedisModuleOptions => ({
            type: 'single', 
            options: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              password: configService.get<string>('REDIS_PASSWORD'), 
            },
          }),
        }), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService : ConfigService) =>({
        uri: configService.get<string>('MONGO_URI')
      }), 
      inject: [ConfigService],
    }),

    AuthModule,
    BooksModule,
    UsersModule,
    CommentsModule
  ],
  
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
