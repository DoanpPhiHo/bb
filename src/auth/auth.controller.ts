import { BadRequestException, Body, Controller, Get, Header, Param, Post, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly service: AuthService,
    ) { }
    @Post('login')
    async login(
        @Body() user: User,
    ): Promise<any> {
        const userInfo: User = await this.service.getUser(user)
        if (userInfo == null)
            throw new BadRequestException(`no user ${user.username} pass: ${user.password}`)
        if (userInfo.status === false) throw new UnauthorizedException()
        const tokenstr: string = await this.service.createToken(userInfo);
        return {
            user: userInfo,
            token: tokenstr,
            tokenInfo: await this.service.verifyToken(tokenstr)
        }
    }
    @Get('verifytoken/:token')
    async verifyToken(@Param('token') token: string) {
        return await this.service.verifyToken(token);
    }
}
