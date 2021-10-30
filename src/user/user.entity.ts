import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number
    @Column()
    name: string
    @Column({ nullable: true })
    birthday: Date
    @Column({ nullable: true })
    gender: string
    @Column({ nullable: true })
    address: string
    @Column({ nullable: true })
    phone: string
    @Column({ nullable: true, default: 1 })
    status: boolean
    @Column({ nullable: true })
    ppno: string
    @Column({ unique: true })
    username: string
    @Column({ nullable: false })//select: false,
    password: string
}
