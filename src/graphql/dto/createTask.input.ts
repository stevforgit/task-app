import { ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

@ArgsType()
export class CreateTaskInput {
  @IsNotEmpty()
  @IsInt()
  readonly listId: number;

  @MaxLength(100)
  readonly title?: string;
}
