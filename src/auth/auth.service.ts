import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async validateUser(userInfo: string): Promise<any> {
        return { user: userInfo }
    }

    async getUser(user: User) {
        return await this.userService.getUserInfo(user)
    }

    async createToken(user: User) {
        return this.jwtService.sign({
            id: user.id,
            code: user.phone,
        })
    }
    async verifyToken(token: string) {
        return await this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
    }
    killToken(token: string) {

    }
}
