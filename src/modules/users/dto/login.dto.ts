
import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({ description: 'User email' })
    @IsString()
    email: string

    @ApiProperty({ description: 'User password' })
    @IsString()
    password: string
}
