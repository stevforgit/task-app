import { ArgsType, Field } from '@nestjs/graphql';
import { List, PageInfo } from '../graphql';

@ArgsType()
export class GetListArgs {
  @Field({ defaultValue: 1 })
  page?: number = 1;

  @Field({ defaultValue: 10 })
  pageSize?: number = 10;
}

export interface PagedResult {
  lists?: any;
  pageInfo: PageInfo;
}
