import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repository: Repository<User>,) { }
  async getUserInfo(user: User) {
    if (!user && !user.password && !user.username) {
      return null
    }
    let pass
    let decPass
    try {
      decPass = Buffer.from(user.password, 'base64').toString()
    } catch (error) {
      throw new BadRequestException('dec Pass error')
    }
    try {
      pass = decPass + user.username//decode pass + gen code pass
    } catch (error) {
      throw new BadRequestException('+ error')
    }
    console.log(user.username, Buffer.from(pass).toString('base64'))
    const userDb: User = await this.repository.findOne({
      // loadRelationIds: true,
      where: [{
        username: user.username,
        password: Buffer.from(pass).toString('base64'),
      }],
    })
    if (!userDb)
      return null
    return userDb
  }
  async getAll() {
    try {
      return await this.repository.find({});
    } catch (error) {
      throw new BadRequestException('server error', error)
    }
  }
  async getById(id: number) {
    try {
      return await this.repository.findOne({
        where: [{ id: id }],
        loadRelationIds: true
      });
    } catch (error) {
      throw new BadRequestException('server error', error)
    }
  }
  /**
   * 
   * @param user 
   * @returns pass word request mã hóa base64(btoa)
   */
  async create(user: User) {
    if (!user && !user.password && !user.username) throw new BadRequestException('user is not vaild', 'user or password is not empty')
    let pass
    let decPass
    try {
      decPass = Buffer.from(user.password, 'base64').toString()
    } catch (error) {
      throw new BadRequestException('dec Pass error')
    }
    try {
      pass = decPass + user.username//decode pass + gen code pass
    } catch (error) {
      throw new BadRequestException('+ error')
    }
    let userDb
    try {
      userDb = await this.repository.save({
        id: undefined,
        ...user,
        password: Buffer.from(pass).toString('base64'),//window.btoa(pass)
      })
    } catch (error) {
      throw new BadRequestException('save err' + error)
    }
    return userDb
  }
  async createDemo(user: User) {
    const pass = user.password + user.username//decode pass + gen code pass
    let userDb
    try {
      await this.repository.save({
        id: undefined,
        ...user,
        password: Buffer.from(pass).toString('base64'),//window.btoa(pass)
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
    return userDb
  }
  async update(id: number, user: User) {
    const userDb = await this.repository.findOneOrFail({ id: id })
    if (!userDb) throw new NotFoundException('id not found')
    let pass
    let decPass
    if (user.password) {
      try {
        decPass = Buffer.from(user.password, 'base64').toString()
      } catch (error) {
        throw new BadRequestException('dec Pass error')
      }
      try {
        pass = decPass + userDb.username//decode pass + gen code pass
        console.log(pass)
      } catch (error) {
        throw new BadRequestException('+ error')
      }
    }
    let password
    if (user.password) password = Buffer.from(pass).toString('base64')
    console.log(password)
    try {
      return await this.repository.save({
        id: id,
        ...user,
        password
      })
    } catch (error) {
      throw new BadRequestException('server error', error)
    }
  }

  async updatePass(user: User, newPass: string) {
    if (!user && !user.password) throw new BadRequestException('user is not vaild', 'user or password is not empty')
    const us = await this.repository.findOneOrFail({ where: { id: user.id } })
    user.username = us.username
    let pass
    let decPass
    try {
      decPass = Buffer.from(user.password, 'base64').toString()
    } catch (error) {
      throw new BadRequestException('dec Pass error')
    }
    try {
      pass = decPass + user.username//decode pass + gen code pass
    } catch (error) {
      throw new BadRequestException('+ error')
    }
    const userDb = await this.repository.findOne({ where: { password: Buffer.from(pass).toString('base64'), username: user.username } })
    if (!userDb) throw new NotFoundException('id or pass not found')

    try {
      decPass = Buffer.from(newPass, 'base64').toString()
    } catch (error) {
      throw new BadRequestException('dec Pass error')
    }
    try {
      pass = decPass + user.username//decode pass + gen code pass
      console.log(pass)
    } catch (error) {
      throw new BadRequestException('+ error')
    }

    try {
      return await this.repository.save({
        ...userDb,
        password: Buffer.from(pass).toString('base64'),
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

  //#region core
  createPassRandom() {
    var a = "",
      b = "abcdefghijklmnopqrstuvwxyz1234567890",
      c = 6;
    for (let ma = 0; ma < c; ma++) {
      a += b[Math.floor(Math.random() * b.length)];
    }
    return a
  }
  //#endregion
}
