import { BadRequestException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusTransaction } from './status-transaction.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class StatusTransactionService {
    constructor(@InjectRepository(StatusTransaction) private repository: Repository<StatusTransaction>,) { }
    async getAll() {
        try {
            return await this.repository.find({});
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getById(id: number) {
        if (!uuidValidate(id))
            throw new BadRequestException('id is not vaild', `invalid input syntax for type uuid: '${id}'`)
        try {
            return await this.repository.find({
                where: [{ id: id }],
                loadRelationIds: true
            });
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    
    async create(model: StatusTransaction) {
        const userDb = await this.repository.save({
            ...model,
        })
        return userDb
    }
    async update(id: number, model: StatusTransaction) {
        if (!uuidValidate(id))
            throw new BadRequestException('id is not vaild', `invalid input syntax for type uuid: '${id}'`)
        const userDb = await this.repository.findOneOrFail({ id: id })
        if (!userDb) throw new NotFoundException('id not found')
        try {
            return await this.repository.save({
                id: id,
                ...model,
            })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async delete(id: number) {
        if (!uuidValidate(id))
            throw new BadRequestException('id is not vaild', `invalid input syntax for type uuid: '${id}'`)
        const userDb = await this.repository.findOneOrFail({ id: id })
        if (!userDb) throw new NotFoundException('id not found')
        try {
            return await this.repository.delete({
                id: id,
            })
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
}
