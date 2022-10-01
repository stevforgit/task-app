import { ArgsType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@ArgsType()
export class MoveTaskInput {
  @IsNotEmpty()
  @IsInt()
  readonly taskId: number;

  @IsNotEmpty()
  @IsInt()
  readonly position: number;
}
