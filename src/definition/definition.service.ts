import { BadRequestException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Definition } from './definition.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class DefinitionService {
    constructor(@InjectRepository(Definition) private repository: Repository<Definition>,) { }
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
    async create(model: Definition) {
        const userDb = await this.repository.save({
            ...model,
        })
        return userDb
    }
    async update(id: number, model: Definition) {
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
