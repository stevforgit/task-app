import { Injectable } from '@nestjs/common';
import { List } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(page: number, pageSize: number): Promise<List[] | null> {
    const listResult = this.prismaService.list.findMany({
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            order: true,
            listId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            completed: true,
          },
          orderBy: {
            order: 'desc',
          },
        },
      },
      skip: (page > 0 ? page - 1 : 0) * pageSize,
      take: pageSize,
    });
    return listResult;
  }

  async getTotalCount() {
    return this.prismaService.list.count();
  }
}
