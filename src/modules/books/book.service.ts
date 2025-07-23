import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../users/model/user.model';
import { Book } from './model/book.schema';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdatedBookDTO } from './dto/update-book.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel:Model<Book>,

        @InjectModel(User.name)
        private userModel:Model<User>,
        
        @InjectRedis() private redisCacheMem: Redis
    ){}

    async createBook(createBookDto: CreateBookDTO, userId: string):Promise<{msg: string, newBook: Book}>{
        const { title, bio, author } = createBookDto

        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('user not found')

        // Check for duplicate book by title and author (user.id)
        const isBook = await this.bookModel.findOne({ title, author: user.id })
        if (isBook) throw new BadRequestException(`book with ${title} and this author exists`)

        const newBook = await this.bookModel.create({
            title,
            bio,
            author
        })

        // Invalidate books cache (delete all book list caches)
        await this.redisCacheMem.del('books__*')

        return {
            msg: 'Book created successfully',
            newBook
        }
    }


    async getBookById(bookId: string): Promise<any> {
    const cacheKey = `book_${bookId}`

    const cachedBook = await this.redisCacheMem.get(cacheKey)
    if (cachedBook) return JSON.parse(cachedBook)

    const book = await this.bookModel.findById(bookId).populate('author')

    if (!book) {
    throw new NotFoundException(`Book with id ${bookId} Not Found`)
    } 

    await this.redisCacheMem.set(cacheKey, JSON.stringify(book), 'EX', 60);

    return {
    msg: 'book found',
    book,
  };
}

    async getBooks(
        filter: { name: string, author: string, genre: string },
        limit, page
        ):Promise<{msg: string, book: Book[]}>{

        const cacheKey = `books__${page}_${limit}`

        // peform query from redis(cache memory) using redis key above
        const cachedBook = await this.redisCacheMem.get(cacheKey)
        console.log('cace',cachedBook);
        
        
        // return book if in cache memory
        if(cachedBook) return JSON.parse(cachedBook)

        const query: any = {}
        if(filter?.name) query.name = { $reg: filter.name, $options:'i'}

        if(filter?.author) query.author = { $reg: filter?.author, $options: 'i' }

        if(filter?.genre) query.genre = { $reg: filter?.genre, $options: 'i' }


        const books = await this.bookModel.find()
            .find(query)
            .populate('author')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec()

        if(!books) throw new NotFoundException(`Book Not Found`)

        // save books in cache memory and expire after  
        await this.redisCacheMem.set(cacheKey, JSON.stringify(books), 'EX', 60)        

        return {
            msg: 'book found',
            book: books
        }    
    }


    async updateBook(updatedBookDTO:UpdatedBookDTO):Promise<{msg: string; updateBook: Book}>{
        const { bookId, authorId } = updatedBookDTO

      const author = await this.userModel.findById(authorId)  
      if(!author) throw new NotFoundException('not an author')

    const updateBook = await this.bookModel.findByIdAndUpdate(
         bookId ,
        { $set : updatedBookDTO },
        { runValidators: true, new: true }
    )   
    console.log(updateBook);
    
    
    
    if (!updateBook) throw new NotFoundException('Book not found');

    return { 
        msg: 'book updated successfully',
        updateBook
    }
    }

    async deleteBook(deleteBookDto: DeleteBookDto){
       
        const { bookId, author_id } = deleteBookDto

      const author = await this.userModel.findById(author_id)  
      if(!author) throw new NotFoundException('not an author')

    const deleteBook = await this.bookModel.findByIdAndDelete( bookId )
    
    if(!deleteBook) throw new NotFoundException('book not found')

    await this.redisCacheMem.del(`book_${bookId}`) 
    
    return {msg: 'book deleted successfully'}
    }

    
}
