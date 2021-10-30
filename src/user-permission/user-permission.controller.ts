import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserPermission } from './user-permission.entity';
import { UserPermissionService } from './user-permission.service';

@Controller('user-permission')
export class UserPermissionController {
    constructor(
        private service: UserPermissionService
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
    async create(@Body() model: UserPermission) {
        return await this.service.create(model);
    }
    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: number, @Body() model: UserPermission) {
        return await this.service.update(id, model);
    }
    @Put('list/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateList(@Param('id') id: number, @Body('list') model: Array<number>) {
        return await this.service.updateList(id, model);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: number,) {
        return await this.service.delete(id);
    }
}
