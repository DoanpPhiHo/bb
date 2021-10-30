import { Module } from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { DefinitionController } from './definition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from './definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Definition])],
  providers: [DefinitionService],
  controllers: [DefinitionController]
})
export class DefinitionModule { }
