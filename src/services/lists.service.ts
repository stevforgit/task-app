import { Injectable } from '@nestjs/common';
import { List } from '@prisma/client';
import { CreateListInput } from 'src/graphql/dto/createList.input';
import { PrismaService } from './prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(page: number, pageSize: number): Promise<List[] | null> {
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
    return listResult;
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
