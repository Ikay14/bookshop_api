import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'User email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;
 
  @ApiProperty({ description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  picture: string;

  @ApiPropertyOptional({ description: 'OAuth provider' })
  @IsOptional()
  provider: string;
}