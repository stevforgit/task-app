import { ArgsType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@ArgsType()
export class CreateListInput {
  @MaxLength(100)
  readonly title: string;
}
