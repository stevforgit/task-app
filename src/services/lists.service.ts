import { Injectable } from '@nestjs/common';
import { List } from '@prisma/client';
import { CreateListInput } from 'src/graphql/dto/createList.input';
import { PrismaService } from './prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(page = 1, pageSize = 10) {
    const listResult = await this.prismaService.list.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        tasks: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      skip: (page > 0 ? page - 1 : 0) * pageSize,
      take: pageSize,
    });
    const totalCount = await this.getTotalCount();
    const pageInfo = {
      totalCount: totalCount,
      page: page,
      pageSize: pageSize,
      hasNextPage: totalCount - page * pageSize > 0,
    };
    return { listResult, pageInfo };
  }

  async createList(data: CreateListInput): Promise<List> {
    return this.prismaService.list.create({
      data: data,
    });
  }

  async getTotalCount() {
    return this.prismaService.list.count({
      where: {
        deletedAt: null,
      },
    });
  }
}
