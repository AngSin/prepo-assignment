import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { DatabaseService } from '../config/database.service';

@Module({
  imports: [],
  controllers: [TransfersController],
  providers: [TransfersService, DatabaseService],
})
export class TransfersModule {}
