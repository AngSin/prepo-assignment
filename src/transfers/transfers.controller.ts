import {
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AddressPipe } from './validation/address.pipe';
import { Address } from 'viem';
import { TransfersService } from './transfers.service';
import { Transfer } from '@prisma/client';
import { Direction } from './transfers.types';
import { DirectionPipe } from './validation/direction.pipe';

@Controller('/transfers')
export class TransfersController {
  constructor(private transferService: TransfersService) {}

  @Get()
  async getTransfersBy(
    @Query('address', AddressPipe) address: Address,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('direction', DirectionPipe) direction: Direction,
  ): Promise<Transfer[]> {
    try {
      return this.transferService.getTransfersByAddress(
        address,
        limit,
        offset,
        direction,
      );
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
