import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDTO {
    @ApiProperty({ description: 'Title of the book' })
    @IsString()
    title: string

    @ApiProperty({ description: 'Price of the book', type: Number })
    @IsNumber()
    price: number

    @ApiProperty({ description: 'Author of the book' })
    @IsString()
    author: string

    @ApiProperty({ description: 'Bio of the book' })
    @IsString()
    bio: string

    @ApiProperty({ description: 'Publisher of the book' })
    @IsString()
    publisher: string
}