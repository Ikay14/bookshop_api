import { Module } from '@nestjs/common';
import { BookService } from './book.service';   
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './model/book.schema';
import { User, UserSchema } from '../users/model/user.model';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: Book.name, schema: BookSchema},
            { name: User.name, schema: UserSchema }
        ])
    ],

    providers: [BookService, JwtService],
    controllers: [BooksController]
})
export class BooksModule {}
