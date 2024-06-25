import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { Transfer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Direction } from './transfers.types';
import { DatabaseService } from '../config/database.service';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

describe('TransfersController', () => {
  let controller: TransfersController;
  let transfersService: TransfersService;
  let databaseService: DatabaseService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        TransfersService,
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'https://rpc.blast.io'), // rpc endpoint needed for TransfersService instantiation
          },
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    transfersService = module.get<TransfersService>(TransfersService);
  });

  describe('getTransfersBy', () => {
    it('should return the transfers found by the service layer', async () => {
      const dummyAddress = '0xE03E3F9aD56862184594F95811bD18cDC0Bab495';
      const expectedResult: Transfer[] = [
        {
          id: '244e8626-9f61-485b-9240-23211629b7c7',
          transactionHash:
            '0xa192b0c6ed87f146a661481ff71c6462c7cda0a6ab3488a101c9304494dbacc6',
          from: dummyAddress,
          to: dummyAddress,
          blockNumber: 1361354,
          valueInETH: new Decimal('3.999999999999999999'),
        },
      ];

      jest
        .spyOn(transfersService, 'getTransfersByAddress')
        .mockImplementation(() => Promise.resolve(expectedResult));

      const res = await controller.getTransfersBy(
        dummyAddress,
        1,
        1,
        Direction.IN,
      );

      expect(transfersService.getTransfersByAddress).toHaveBeenCalledWith(
        dummyAddress,
        1,
        1,
        Direction.IN,
      );
      expect(res).toEqual(expectedResult);
    });

    it('should return a 500 if service layer fails', async () => {
      const dummyAddress = '0xE03E3F9aD56862184594F95811bD18cDC0Bab495';

      jest
        .spyOn(transfersService, 'getTransfersByAddress')
        .mockImplementation(() => {
          throw new Error();
        });

      await expect(async () => {
        await controller.getTransfersBy(dummyAddress, 1, 1, Direction.IN);
      }).rejects.toThrow(InternalServerErrorException);

      expect(transfersService.getTransfersByAddress).toHaveBeenCalledWith(
        dummyAddress,
        1,
        1,
        Direction.IN,
      );
    });
  });
});
