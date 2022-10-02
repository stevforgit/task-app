import { ArgsType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Length } from 'class-validator';

@ArgsType()
export class CreateTaskInput {
  @IsNotEmpty()
  @IsInt()
  readonly listId: number;

  @Length(1, 200)
  readonly title?: string;
}
