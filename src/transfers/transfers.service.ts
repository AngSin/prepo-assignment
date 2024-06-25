import { Injectable } from '@nestjs/common';
import {
  Address,
  createPublicClient,
  erc20Abi,
  formatEther,
  http,
  PublicClient,
} from 'viem';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../config/database.service';
import { Transfer } from '@prisma/client';
import { Direction } from './transfers.types';

@Injectable()
export class TransfersService {
  private client: PublicClient;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    // @ts-expect-error type instantiation is too deep
    this.client = createPublicClient({
      chain: {
        id: this.configService.get<number>('chain.id'),
        name: this.configService.get<string>('chain.name'),
        nativeCurrency: {
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: [this.configService.get<string>('chain.rpcEndpoint')],
          },
        },
      },
      transport: http(this.configService.get<string>('chain.rpcEndpoint')),
    });
  }
  async onApplicationBootstrap() {
    const transferEvent = erc20Abi.find((event) => event.name === 'Transfer');
    const latestBlockNumber = await this.client.getBlockNumber();
    const blockLimitForEthLogs = 2_000;
    const lastStoredTransfer = await this.databaseService.transfer.findFirst({
      orderBy: { blockNumber: 'desc' },
      select: { blockNumber: true },
    });

    const startBlock = lastStoredTransfer ? lastStoredTransfer.blockNumber : 0;

    for (
      let i = startBlock;
      i < Number(latestBlockNumber);
      i += blockLimitForEthLogs
    ) {
      const fromBlock = i;
      const toBlock = i + blockLimitForEthLogs;
      const logs = await this.client.getLogs({
        address: this.configService.get<`0x${string}`>('tokenAddress'),
        event: transferEvent,
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });
      console.warn(
        `Application blocked, inserting ${logs.length} transfers from block #${fromBlock} to ${toBlock}`,
      );
      const transfers = logs.map((log) => ({
        from: log.args.from,
        to: log.args.to,
        blockNumber: Number(log.blockNumber ?? 0),
        transactionHash: log.transactionHash,
        valueInETH: formatEther(log.args.value),
      }));
      await this.databaseService.transfer.createMany({
        data: transfers,
      });
    }
    console.info(
      'Finished importing WETH transfers, application is ready for use',
    );
  }

  getTransfersByAddress(
    address: Address,
    limit: number,
    offset: number,
    direction?: Direction,
  ): Promise<Transfer[]> {
    const fromClause = {
      from: address,
    };
    const toClause = {
      to: address,
    };
    const bothDirectionClauses = [fromClause, toClause];
    let clauses: ({ from: Address } | { to: Address })[];
    if (direction === Direction.IN) {
      clauses = [toClause];
    } else if (direction === Direction.OUT) {
      clauses = [fromClause];
    } else {
      clauses = bothDirectionClauses;
    }
    return this.databaseService.transfer.findMany({
      where: {
        OR: clauses,
      },
      skip: offset,
      take: limit,
    });
  }
}
