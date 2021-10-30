import { Body, Controller, Delete, Get, Param, Post, Put, Response, StreamableFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(
        private service: TransactionService
    ) { }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getall() {
        return await this.service.getAll();
    }
    @Get('/print-file/:id/:createId')
    async getFile(@Response() res, @Param('id') id: number, @Param('createId') createId: number,) {
        res.set({
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'image/jpeg',
            'Content-Type': 'application/pdf',
            // 'Content-Disposition': 'attachment; filename="f.pdf"',
        });
        return await this.service.printBill(createId, id, res)

    }
    @Get('/:from/:to/:statusId')
    @UseGuards(AuthGuard('jwt'))
    async getFilter(@Param('from') from: string, @Param('to') to: string, @Param('statusId') statusId: number) {
        return await this.service.getFilter(from, to, statusId);
    }
    @Get('/:id')
    @UseGuards(AuthGuard('jwt'))
    async getById(@Param('id') id: number) {
        return await this.service.getById(id);
    }
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() model: Transaction) {
        return await this.service.create(model);
    }
    @Put('/:id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: number, @Body() model: Transaction) {
        return await this.service.update(id, model);
    }
    @Put('status/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateStatus(@Param('id') id: number, @Body() model: Transaction) {
        return await this.service.updateStatus(id, model);
    }
    @Delete('/:id')
    @UseGuards(AuthGuard('jwt'))
    async delete(@Param('id') id: number,) {
        return await this.service.delete(id);
    }
}
