import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { CreateBookDTO } from "./create-book.dto";
import { ApiProperty } from '@nestjs/swagger';

export class UpdatedBookDTO extends PartialType(CreateBookDTO){
    @ApiProperty({ description: 'Review for the book' })
    @IsString()
    review:string

    @ApiProperty({ description: 'Book ID' })
    @IsString()
    bookId: string

    @ApiProperty({ description: 'Author ID' })
    @IsString()
    authorId: string
}