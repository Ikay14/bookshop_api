import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowDTO } from './dto/follow.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}


    @Post('follow')
    @ApiOperation({ summary: 'Follow a user' })
    @ApiBody({ type: FollowDTO })
    @ApiResponse({ status: 201, description: 'User followed' })
    async followAUser(
        @Body() followUser: FollowDTO
    ){
        return this.userService.followUser(followUser)
    }


    @Delete('unfollow')
    @ApiOperation({ summary: 'Unfollow a user' })
    @ApiBody({ type: FollowDTO })
    @ApiResponse({ status: 200, description: 'User unfollowed' })
    async unFollow(
        @Body() followUser: FollowDTO
    ){
        return this.userService.unFollowUser(followUser)
    }


    @Get(':id/getFollowers')
    @ApiOperation({ summary: 'Get followers of a user' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, description: 'List of followers' })
    async getFollowers(
        @Param('id') userId: string,
        @Query() query: { page?: string; limit?: string }
    ){
        return this.userService.getFollowers(userId, query) 
    } 

    @Get(':id/getFollowing')
    @ApiOperation({ summary: 'Get users followed by a user' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiResponse({ status: 200, description: 'List of followings' })
    async getFollowing(
        @Param('id') userId: string,
        @Query() query: { page?: string; limit?: string }
    ){
        return this.userService.getFollowing(userId, query)
    }
}
