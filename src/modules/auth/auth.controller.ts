import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register.user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO } from '../users/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}



    @Get('google')
    @ApiOperation({ summary: 'Google OAuth login' })
    @ApiResponse({ status: 200, description: 'Redirect to Google OAuth' })
    @UseGuards(AuthGuard('google'))
    googleLogin() {}



    @Get('google/redirect')
    @ApiOperation({ summary: 'Google OAuth redirect' })
    @ApiResponse({ status: 200, description: 'Handle Google OAuth redirect' })
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req) {
        return this.authService.handleOAuthLogin(req.user);
    }


    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'User registered' })
    async registerUser(
      @Body() registerDto: RegisterUserDto){
      return this.authService.registerUser(registerDto);
    }


    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginDTO })
    @ApiResponse({ status: 200, description: 'User logged in' })
    async loginUser(
      @Body() loginDto: LoginDTO){
      return this.authService.loginUser(loginDto);
    }

  }
