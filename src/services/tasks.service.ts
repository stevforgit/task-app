import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskInput } from 'src/graphql/dto/createTask.input';
import { MoveTaskInput } from 'src/graphql/dto/moveTask.input';
import { UpdateTaskInput } from 'src/graphql/dto/updateTask.input';
import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTask(data: CreateTaskInput): Promise<Task> {
    const { listId, title } = data;
    const list = await this.prismaService.list.findUnique({
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

    if (list.tasks.length > 0) {
      await this.prismaService.$transaction([
        this.prismaService.task.updateMany({
          where: { listId: listId },
          data: { order: { increment: 1 } },
        }),
      ]);
    }
    return this.prismaService.task.create({
      data: { listId: listId, title: title, order: 1 },
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
}
