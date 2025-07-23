import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from '../users/model/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from '../users/dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(    
                @InjectModel(User.name) 
                private userModel:Model<UserDocument>,
                private jwtService: JwtService,
                private configService: ConfigService
){}
async handleOAuthLogin(oauthUser: RegisterUserDto) {
  const { email } = oauthUser;

  // Check if user already exists
  let user;
  try {
    user = await this.userModel.findOne({ email });
  } catch (err) {
    console.error('Error finding user by email:', err);
    throw err;
  }

  if (!user) {
    try {
      user = await this.userModel.create({
        email,
        firstName: oauthUser.firstName,
        lastName: oauthUser.lastName,
        picture: oauthUser.picture,
        provider: oauthUser.provider,  
      });
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  

  // Generate access token

  let accessToken;
  try {
    accessToken = await this.generateAccessToken(user);
  } catch (err) {
    console.error('Error generating access token:', err);
    throw err;
  }

  return { accessToken, user };
}


async registerUser(registerDto: RegisterUserDto):Promise<{  
        msg: string;
        accessToken: string;
        user: Partial<User>;
    }> {

        const { email, password, firstName, lastName } = registerDto

        const user = await this.userModel.findOne({ email })
        if(user) throw new BadRequestException(`User with ${email} exists, please proceed to login`) 
       
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await new this.userModel({
            email,
            firstName,
            lastName,
            password: hashPassword,
        })

        await newUser.save()

         const accessToken = await this.generateAccessToken(newUser)
        return {
            msg: 'new user created successfully',
            accessToken,
            user: newUser.sanitize()
        }
    }

    async loginUser(loginDto: LoginDTO): Promise<{ msg: string, accessToken: string; user: Partial<User>; }> {
        const { email, password } = loginDto
        const user = await this.userModel.findOne({ email });
        if (!user) throw new BadRequestException(`User with ${email} not found`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestException(`Invalid credentials`);

        const accessToken = await this.generateAccessToken(user);
        return {
            msg: 'user login successful',
            accessToken,
            user
        };
    }

    private async generateAccessToken(user: User){
        const payload = {
            id: user._id,
            email: user.email
        }

        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d'
        })
    }
}
