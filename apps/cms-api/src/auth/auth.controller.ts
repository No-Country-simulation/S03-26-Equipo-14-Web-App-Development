import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { raw, Request, response, Response } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';
import {
  CreateRegisterMemberDto,
  CreateRegisterOwnerDto,
} from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { ValidateTokenQueryDto } from './dto/validate-token-query.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import globalEnv from '@repo/env';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService: JwtService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(loginDto);
    // Dev config
    res.cookie('CMS_ACCESS_TOKEN', access_token, {
      httpOnly: true,
      secure: globalEnv.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    return {
      message: 'Login successful',
    };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {

    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('me')
  async me(@GetUser() user: JwtPayload) {
    return user;
  }
  @Public()
  @Post('owner')
  async owner(@Body() registerOwnerDto: CreateRegisterOwnerDto) {
    //use service registerOwner
    return this.authService.registerOwner(registerOwnerDto);
  }

  @Public()
  @Post("validate-token")
  async ValidateToken(@Body() validateTokenDto : ValidateTokenDto, @Query() validateTokenQueryDto: ValidateTokenQueryDto, @Res({ passthrough: true }) res: Response) {
    const resetToken: string = await this.authService.validateToken({token: validateTokenDto.token, email: validateTokenQueryDto.email});

    // Dev config
    res.cookie('RESET_PASSWORD_TOKEN', resetToken, {
      httpOnly: true,
      secure: globalEnv.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    return {
      message: 'Token valid',
    }
  }

  @Public()
  @Post("reset-password")
  async resetPassword(@Req() req : Request, @Res({passthrough: true}) res: Response, @Body() resetPasswordDto: ResetPasswordDto) {

    const token = req.cookies['RESET_PASSWORD_TOKEN'];
    if(!token) throw new UnauthorizedException('Invalid token');

    const payload : {userId: string}= this.jwtService.verify(token, {
      secret: globalEnv.JWT_RESET_TOKEN_SECRET
    })

    const result = this.authService.resetPassword({userId: payload.userId, newPassword: resetPasswordDto.newPassword});
    res.clearCookie("RESET_PASSWORD_TOKEN");
    res.clearCookie("CMS_ACCESS_TOKEN");

    return result
  }

  @Public()
  @Post('member')
  async member(@Body() registerMemberDto: CreateRegisterMemberDto) {
    //use service registerMember
    return this.authService.registerMember(registerMemberDto);
  }

  

}
