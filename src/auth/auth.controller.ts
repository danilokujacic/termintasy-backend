import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GmailLoginDTO, LoginDTO, RegisterDTO } from '../types';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request) {
    return this.authService.me(request.user.sub);
  }
  @Post('register')
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }
  @Delete('logout')
  logout() {
    return 'Me';
  }
  @Post('oidc/gmail/login')
  async loginGmail(@Body() emailDto: GmailLoginDTO) {
    return {
      token: await this.authService.gmailLogin(emailDto),
    };
  }
}
