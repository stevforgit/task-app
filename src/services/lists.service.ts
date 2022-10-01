import { Injectable } from '@nestjs/common';
import { List, Task } from '@prisma/client';
import { CreateListInput } from 'src/graphql/dto/createList.input';
import { MoveTaskInput } from 'src/graphql/dto/moveTask.input';
import { UpdateTaskInput } from 'src/graphql/dto/updateTask.input';
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

  async updateTask(data: UpdateTaskInput): Promise<Task> {
    const { id, title, completed } = data;
    return this.prismaService.task.update({
      where: {
        id: id,
      },
      data: {
        ...(title && { title }),
        ...(completed && { completed }),
      },
    });
  }

  async createTask(data: any): Promise<Task> {
    const { listId } = data;
    const list = this.prismaService.list.findUnique({
      where: {
        id: listId,
      },
      include: {
        tasks: {
          select: {
            id: true,
            order: true,
            listId: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const tasks = (await list).tasks;
    if (tasks.length > 0) {
      await this.prismaService.$transaction([
        this.prismaService.task.updateMany({
          where: { listId: listId },
          data: { order: { increment: 1 } },
        }),
      ]);
    }
    return this.prismaService.task.create({
      data: { ...data, order: 1 },
    });
  }

  async moveTask(data: MoveTaskInput): Promise<Task> {
    const { taskId, position } = data;
    const task = await this.prismaService.task.findFirstOrThrow({
      where: { id: taskId },
    });

    const list = await this.prismaService.list.findFirstOrThrow({
      where: { id: task.listId },
      include: {
        tasks: {
          select: {
            id: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const availablePositions = list.tasks.map((r) => r.order);
    const maxPosition = Math.max(...availablePositions);
    // check if move is valid
    if (position > 0 && position <= maxPosition) {
      const bottomToTop = task.order > position;
      if (bottomToTop) {
        const tasks = list.tasks.filter(
          (r) => r.order >= position && r.order < task.order,
        );

        await this.prismaService.$transaction([
          this.prismaService.task.updateMany({
            where: { id: { in: tasks.map((r) => r.id) } },
            data: { order: { increment: 1 } },
          }),
        ]);
      } else {
        const tasks = list.tasks.filter(
          (r) => r.order > task.order && r.order <= position,
        );
        await this.prismaService.$transaction([
          this.prismaService.task.updateMany({
            where: { id: { in: tasks.map((r) => r.id) } },
            data: { order: { decrement: 1 } },
          }),
        ]);
      }
    }

    return this.prismaService.task.update({
      where: { id: taskId },
      data: { order: position },
    });
  }

  async getTotalCount() {
    return this.prismaService.list.count();
  }
}
