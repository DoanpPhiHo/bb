import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionController } from './user-permission.controller';
import { UserPermission } from './user-permission.entity';
import { UserPermissionService } from './user-permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission])],
  controllers: [UserPermissionController],
  providers: [UserPermissionService]
})
export class UserPermissionModule {}
