import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Definition {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number
    @Column()
    name: string
    @Column()
    value: string
}