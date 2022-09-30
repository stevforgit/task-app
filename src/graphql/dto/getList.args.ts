import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetListArgs {
  @Field({ defaultValue: 1 })
  page?: number;

  @Field({ defaultValue: 10 })
  pageSize?: number;
}
