import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Address, isAddress } from 'viem';

@Injectable()
export class AddressPipe implements PipeTransform {
  transform(value: string): Address {
    if (isAddress(value)) {
      return value;
    }
    throw new BadRequestException('Invalid address input!');
  }
}
