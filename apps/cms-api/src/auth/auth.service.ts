import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService ,
        private prismaService: PrismaService
    ){}

    async validateUser(email: string, pass: string): Promise<any>{
        // TODO: validate user
        const user = {email: email, password: pass, _id: "123"}

        if(!user) throw new UnauthorizedException("Invalid credentials");
        
        const isMatch = pass === user.password
        if(!isMatch) throw new UnauthorizedException("Password not valid");

        return {_id: user._id}
    }

    async login(loginDto: {email: string, password: string}){
        const user = await this.validateUser(loginDto.email, loginDto.password);                      
        const payload = {sub: user._id};
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

}
