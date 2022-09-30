import { Injectable } from '@nestjs/common/decorators';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListsService } from 'src/services/lists.service';
import { GetListArgs } from 'src/graphql/dto/getList.args';
import { ListResult } from 'src/graphql/graphql';

@Resolver('List')
@Injectable()
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Query('lists')
  async lists(@Args() args: GetListArgs): Promise<ListResult | null> {
    const totalCount = await this.listsService.getTotalCount();
    const data = await this.listsService.findAll(args.page, args.pageSize);
    const result = {
      edges: data,
      totalCount: totalCount,
      pageInfo: {
        totalCount: totalCount,
        page: args?.page,
        pageSize: args?.pageSize,
        hasNextPage: totalCount - args.page * args.pageSize > 0,
      },
    };
    return result;
  }
}
