import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Comments } from './model/comments.model';
import { Book } from '../books/model/book.schema';
import { User } from '../users/model/user.model';
import { AddCommentDTO } from './dto/add-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comments.name)
        private commentModel: Model<Comments>,

        @InjectModel(Book.name)
        private bookModel: Model<Book>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectRedis() private redisCacheMem: Redis
    ){}

    async addComment(addComment: AddCommentDTO): Promise<any> {
    const { userId, bookId, content } = addComment;

    // Check if the user exists
    const user = await this.userModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // Check if the book exists
    const getBook = await this.bookModel.findById(bookId).populate
    if (!getBook) throw new NotFoundException('Book not found')

    // Create and save the comment
    const createComment = new this.commentModel({
    content,
    userId,
    bookId,
    })

    await createComment.save()

    // Push the comment's ObjectId into the book's comments array
    await this.bookModel.findByIdAndUpdate(
    bookId,
    { $push: { comments: createComment._id } },
    { new: true }
  )

  return {
    msg: 'Comment added successfully',
    createComment,
  };
}


    async getBookComments(bookId: string){

        const cacheKey = `book-comment${bookId}`

        const cachedBookComment = await this.redisCacheMem.get(cacheKey)

        // If comments are found in Redis cache, return them immediately (after parsing from JSON)
        if (cachedBookComment) return JSON.parse(cachedBookComment);

        const book = await this.bookModel.findById(bookId)
        if(!book) throw new NotFoundException('not found')

        // Cache the book comments in Redis
        await this.redisCacheMem.set(cacheKey, JSON.stringify(book), 'EX', 60)

        return book    
    }  
    
}
