import { BadRequestException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import { UserPermission } from './user-permission.entity';
import { In } from "typeorm";

@Injectable()
export class UserPermissionService {
    constructor(@InjectRepository(UserPermission) private repository: Repository<UserPermission>,) { }
    async getAll() {
        try {
            return await this.repository.find();
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async getById(id: number) {
        try {
            return await this.repository.find({
                where: [{ userid: id }],
                loadRelationIds: true
            });
        } catch (error) {
            throw new BadRequestException('server error', error)
        }
    }
    async updateList(id: number, model: Array<number>) {
        // const per_user_arr_db = await this.repository.find({ userid: id, permissionid: In(model) })
        const per_user_arr = await this.repository.find({ userid: id })
        for (let t of per_user_arr) {
            if (!model.some((e) => `${e}` === `${t.permissionid}`)) {
                try {
                    await this.repository.delete(t)
                } catch (error) {
                    console.log(`err t: ${error}`)
                }
            }
        }
        for (let t of model) {
            if (!per_user_arr.some((e) => `${e.permissionid}` === `${t}`)) {
                await this.repository.save({
                    permissionid: t,
                    userid: id,
                })
            }
        }
        return { code: 'ok' }
    }
    async create(model: UserPermission) {
        const userDb = await this.repository.save({
            ...model,
        })
        return userDb
    }
    async update(id: number, model: UserPermission) {
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
