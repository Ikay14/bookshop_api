import { Controller,Body, Query, Param, Post, Patch, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdatedBookDTO } from './dto/update-book.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('books')
@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
    constructor(private bookService: BookService){}

    @Post('create')
    @ApiOperation({ summary: 'Create a new book' })
    @ApiBody({ type: CreateBookDTO })
    @ApiResponse({ status: 201, description: 'Book created' })
    async creatBook(
        @Body() creatBook: CreateBookDTO,
        @Req() req
    ){
        const author_id = req.user.id;
        return this.bookService.createBook(creatBook, author_id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiParam({ name: 'id', description: 'Book ID' })
    @ApiResponse({ status: 200, description: 'Book found' })
    async getBookById(
        @Param('id') id: string
    ){
        return this.bookService.getBookById(id)
    }

    @Get()
    @ApiOperation({ summary: 'Filter books' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'filter', required: false })
    @ApiResponse({ status: 200, description: 'Books found' })
    async filterBooks(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('filter') filter: string
    ){
        return this.bookService.getBooks(
            { name: filter, author: filter, genre: filter },
            Number(limit),
            Number(page)
        )
    }

    @Patch('update')
    @ApiOperation({ summary: 'Update a book' })
    @ApiBody({ type: UpdatedBookDTO })
    @ApiResponse({ status: 200, description: 'Book updated' })
    async updateBook(
        @Body() updatedBookDTO: UpdatedBookDTO
    ){
        return this.bookService.updateBook(updatedBookDTO)
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete a book' })
    @ApiBody({ type: DeleteBookDto })
    @ApiResponse({ status: 200, description: 'Book deleted' })
    async deleteBook(
        @Body() deleteBookDto: DeleteBookDto
    ){
        return this.bookService.deleteBook(deleteBookDto)
    }
}   
