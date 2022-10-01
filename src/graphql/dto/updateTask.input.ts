import { ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

@ArgsType()
export class UpdateTaskInput {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;

  @MaxLength(100)
  readonly title?: string;

  @IsBoolean()
  readonly completed?: boolean;
}
