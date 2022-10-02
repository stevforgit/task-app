import { ArgsType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@ArgsType()
export class CreateListInput {
  @Length(1, 200)
  readonly title: string;
}
