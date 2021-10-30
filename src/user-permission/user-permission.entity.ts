import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPermission {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number
    @Column()
    userid: number
    @Column()
    permissionid: number
}