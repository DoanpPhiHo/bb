import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
        constructor(
            private service: PermissionService
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
    async create(@Body() model: Permission) {
        return await this.service.create(model);
    }
    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: number, @Body() model: Permission) {
        return await this.service.update(id, model);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: number,) {
        return await this.service.delete(id);
    }
}
