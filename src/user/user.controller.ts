import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private service: UserService
    ) { }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getall() {
        return await this.service.getAll();
    }
    @Get('/:id')
    @UseGuards(AuthGuard('jwt'))
    async getById(@Param('id') id: number) {
        return await this.service.getById(id);
    }
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() user: User) {
        return await this.service.create(user);
    }
    @Post('demo')
    // @UseGuards(AuthGuard('jwt'))
    async createDemo(@Body() user: User) {
        return await this.service.createDemo(user);
    }
    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: number, @Body() user: User) {
        return await this.service.update(id, user);
    }
    @Post('/pass')
    @UseGuards(AuthGuard('jwt'))
    async updatePass(@Body() user: User, @Body('newPass') newPass: string) {
        return await this.service.updatePass(user, newPass);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: number,) {
        return await this.service.delete(id);
    }
}
