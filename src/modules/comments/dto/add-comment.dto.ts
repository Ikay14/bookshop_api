import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDTO {
    @ApiProperty({ description: 'Book ID' })
    @IsString()
    bookId: string

    @ApiProperty({ description: 'User ID' })
    @IsString()
    userId: string

    @ApiProperty({ description: 'Comment content' })
    @IsString()
    content: string
}