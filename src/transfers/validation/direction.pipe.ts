import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Direction } from '../transfers.types';

@Injectable()
export class DirectionPipe implements PipeTransform {
  transform(value?: string): Direction {
    if (!value) {
      return Direction.BOTH;
    }
    const upperCaseVal = value.toUpperCase();
    if (Direction[upperCaseVal]) {
      return Direction[upperCaseVal];
    }
    throw new BadRequestException('Invalid direction input!');
  }
}
