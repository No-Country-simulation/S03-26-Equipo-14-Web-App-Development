import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import {
  CreateRegisterMemberInput,
  CreateRegisterOwnerInput,
} from './dto/register.dto';
import crypto from 'crypto';
import { UserRepository } from '@repo/api';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';
import sgMail from '@sendgrid/mail';
import globalEnv from '@repo/env';
import { ResetPasswordDto } from 'src/category/dto/reset-password.dto';
import { resetPasswordTemplate } from 'src/mail/templates/reset-password.template';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly apiUser: UserRepository,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    
    const user = await this.apiUser.findByEmail(email);
    console.log(user)
    
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Password not valid');

    const org = user.organizationMembers[0]
    
    return { sub: user.id, email: user.email, organizationId: org?.organization_id || null, role: org?.role || null };
  }

  async login(loginDto: LoginDto) {
    const payload: JwtPayload = await this.validateUser(loginDto.email, loginDto.password);
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerOwner(registerOwnerDto: CreateRegisterOwnerInput) {
    const { password, ...newOwner } = registerOwnerDto;

    const hashPassword = await hash(password, 10);

    const synthUser = {
      ...newOwner,
      hashPassword: hashPassword,
    };

    await this.apiUser.createOwner(synthUser);
  }

  async registerMember(registerMemberDto: CreateRegisterMemberInput) {
    const randomPass = await this.generateRandomPassword();

    const hashPassword = await hash(randomPass, 10);

    const synthUser = {
      ...registerMemberDto,
      generatePassword: hashPassword,
    };

    await this.apiUser.createMember(synthUser);
  }

  async forgotPassword (resetPasswordDto: ResetPasswordDto) {

    const userExist = await this.apiUser.findByEmail(resetPasswordDto.email);
    if (!userExist) throw new NotFoundException("User not found");

    const rawToken = crypto.randomInt(100000, 1000000).toString();
    const hashedToken = await hash(rawToken, 10);
    const resetExpiration = new Date(Date.now() + 3600000); // 1hs    

    await this.mailService.sendResetPassword(userExist.email, userExist.name, rawToken);    
    
    await this.apiUser.setResetToken({userId: userExist.id, resetToken: hashedToken, resetTokenExpires: resetExpiration});

    return {
      message: "Email sent",      
    }
  }

  private async generateRandomPassword() {
    return crypto.randomBytes(4).toString('base64').slice(0, 6);
  }

  
}
