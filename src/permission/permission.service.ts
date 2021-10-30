import { BadRequestException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
    constructor(@InjectRepository(Permission) private repository: Repository<Permission>,) { }
    async getAll() {
        try {
            return await this.repository.find({});
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getById(id: number) {
        try {
            return await this.repository.find({
                where: [{ id: id }],
                loadRelationIds: true
            });
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async create(model: Permission) {
        const userDb = await this.repository.save({
            ...model,
        })
        return userDb
    }
    async update(id: number, model: Permission) {
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
