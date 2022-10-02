import { ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, Length } from 'class-validator';

@ArgsType()
export class UpdateTaskInput {
  @IsNotEmpty()
  @IsInt()
  readonly id: number;

  @Length(1, 200)
  readonly title?: string;

  @IsBoolean()
  readonly completed?: boolean;
}
