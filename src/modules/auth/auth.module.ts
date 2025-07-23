import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { JwtStrategy } from 'src/strategy/p.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/model/user.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
