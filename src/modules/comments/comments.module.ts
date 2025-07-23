import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments,commentSchema } from './model/comments.model';
import { Book, BookSchema } from '../books/model/book.schema';
import { User, UserSchema } from '../users/model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: commentSchema },
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, JwtService]
})
export class CommentsModule {}
