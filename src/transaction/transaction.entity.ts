import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number
    @Column()
    createdBy: number
    @Column({type: 'timestamptz'})
    createDate: Date
    @Column()
    senderName: string
    @Column()
    senderPhone: string
    @Column()
    senderAddress: string
    @Column()
    receiverName: string
    @Column()
    receiverPhone: string
    @Column()
    receiverAccountNumber: string
    @Column()
    receiverBank: string
    @Column()
    transferAmount: string
    @Column()
    fee: string
    @Column()
    content: string
    @Column({ nullable: true })
    transferBy: number
    @Column({ nullable: true,type: 'timestamptz' })
    transferDate: Date
    @Column({ nullable: true })
    statusTransactionID: number
}
