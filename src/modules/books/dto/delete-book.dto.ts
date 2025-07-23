import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBookDto{
    @ApiProperty({ description: 'Author ID' })
    @IsString()
    author_id: string

    @ApiProperty({ description: 'Book ID' })
    @IsString()
    bookId: string
}