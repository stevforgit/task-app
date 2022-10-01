import { Injectable } from '@nestjs/common/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ListsService } from 'src/services/lists.service';
import { GetListArgs } from 'src/graphql/dto/getList.args';
import { List, ListResult } from 'src/graphql/graphql';
import { CreateListInput } from '../dto/createList.input';

@Resolver('List')
@Injectable()
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Query('getPaginatedList')
  async getPaginatedList(@Args() args: GetListArgs): Promise<ListResult> {
    const data = await this.listsService.findAll(args.page, args.pageSize);
    const totalCount = await this.listsService.getTotalCount();
    const result = {
      lists: data,
      pageInfo: {
        totalCount: totalCount,
        page: args?.page,
        pageSize: args?.pageSize,
        hasNextPage: totalCount - args.page * args.pageSize > 0,
      },
    };
    return result;
  }

  @Mutation('createList')
  async createList(@Args('input') args: CreateListInput): Promise<List> {
    return this.listsService.createList(args);
  }
}
