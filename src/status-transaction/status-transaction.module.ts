import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusTransactionController } from './status-transaction.controller';
import { StatusTransaction } from './status-transaction.entity';
import { StatusTransactionService } from './status-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatusTransaction])],
  providers: [StatusTransactionService],
  controllers: [StatusTransactionController],
})
export class StatusTransactionModule { }
