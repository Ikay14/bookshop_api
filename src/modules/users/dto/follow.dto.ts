import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class FollowDTO {
    @ApiProperty({ description: 'ID of the user performing the follow/unfollow' })
    @IsString()
    userId: string

    @ApiProperty({ description: 'ID of the user to be followed/unfollowed' })
    @IsString()
    targetId: string
}