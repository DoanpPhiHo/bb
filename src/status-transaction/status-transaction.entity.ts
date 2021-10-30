import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StatusTransaction {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number
    @Column()
    name: string
    @Column({ unique: true })
    code: string
}
