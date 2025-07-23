import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],

  providers: [UsersService, JwtService],
  controllers: [UsersController]
})
export class UsersModule {}
