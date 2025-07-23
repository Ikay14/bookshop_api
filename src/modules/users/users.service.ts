import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FollowDTO } from './dto/follow.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ){}


    async followUser(followDTO: FollowDTO){
        const { userId, targetId } = followDTO
        console.log('targeted user', targetId)
        console.log('userId user', userId)

        if(userId === targetId) throw new BadRequestException(`you can't follow yourself`)

        const user = await this.userModel.findById(targetId)
        if(!user) throw new NotFoundException('requested user to follow not found')
            console.log('user', user)
            

        // User follows target user
        await this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { following: targetId } }
        )

        // Target user gets a new follower
        await this.userModel.findByIdAndUpdate(
            targetId,
            { $addToSet: { followers: userId } }
        )

     return { msg: 'user followed' }
    }



    async unFollowUser(unFollowUserDTO: FollowDTO) {
        const { userId, targetId } = unFollowUserDTO

        if (userId === targetId) throw new BadRequestException(`you can't follow yourself`)

        const user = await this.userModel.findById(targetId)
        if (!user) throw new NotFoundException('user not found')

        // Remove targetId from user's following
        await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { following: targetId } }
        )

        // Remove userId from target's followers
        await this.userModel.findByIdAndUpdate(
            targetId,
            { $pull: { followers: userId } }
        )

        return {
            msg: 'user unfollowed'
        }
    }


    async getFollowing(userId: string, query: any):Promise<any>{
        const user = await this.userModel.findById(userId)
        .populate('following')
        if(!user) throw new NotFoundException('user not found')

        const followingIds = user.following

        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const skip = (page - 1) * limit

        const paginateFollowing = await this.userModel.find({
            _id: { $in: followingIds }
        })
        .select('firstName lastName picture email')
        .skip(skip)
        .limit(limit)

        return {
            msg: 'your following',
            totalFollowing: paginateFollowing.length,
            currentPage: page,
            totalPages: Math.ceil(followingIds.length / limit),
            followings: paginateFollowing
        }    
    }

    async getFollowers(userId: string, query: any):Promise<any>{
        const user = await this.userModel.findById(userId)
        .populate('followers')
        if(!user) throw new NotFoundException('user not found')

        const followersId = user.followers

        const page = parseInt(query.page) || 1
        const limit = parseInt(query.limit) || 10
        const skip = (page - 1) * limit
        
        const paginateFollowers = await this.userModel.find({
            _id : { $in : followersId }
        })
        .select('firstName lastName picture email')
        .skip(skip)
        .limit(limit)

        return {
            msg: 'your followers',
            totalFollowers: followersId.length,
            currentPage: page,
            totalPages: Math.ceil(followersId.length / limit),
            followers: paginateFollowers
        }    
    }
}
