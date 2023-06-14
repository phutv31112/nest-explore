import { IsEmail } from 'class-validator';
import { PasswordResetService } from './../password.reset/password.reset.service';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private refreshTokenService: RefreshTokenService,
    private passwordService: PasswordResetService,
  ) {}
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  @Post('refresh-token')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is require!' });
    }
    const isValid = await this.refreshTokenService.validateRefreshToken(
      refreshToken,
    );
    if (!isValid) {
      return res.status(400).json({ message: ' Invalid refresh token' });
    }
    const newAccessToken = await this.refreshTokenService.refreshAccessToken(
      refreshToken,
    );
    console.log('Access-controller:', newAccessToken);
    return res.json({ new_accessToken: newAccessToken });
  }
  @Post('forgot-password')
  async generateResetToken(@Body('email') email: string): Promise<string> {
    return await this.passwordService.generateResetToken(email);
  }
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('resetToken') resetToken: string,
  ): Promise<string> {
    return await this.passwordService.resetPassword(email, resetToken);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return 'login with google';
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    // Xử lý sau khi xác thực thành công
    const user = req.user;
    console.log('user-req:', user);
    const token = await this.authService.loginWithGoogle(user.email);
    res.set('authorization', token.accessToken);
    res.json(user);
    // Chuyển hướng đến trang thành công hoặc trang chính của ứng dụng
    // return res.redirect(
    //   'https://www.youtube.com/watch?v=Qmv3mIR_FdE&ab_channel=JayantPatilTech',
    // );
  }
}
