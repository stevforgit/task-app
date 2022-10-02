import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const list = await this.prismaService.list.findFirst({
      where: { AND: [{ id: listId, deletedAt: null }] },
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
    await this.getTaskByIdOrThrow(id);
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
    const task = await this.getTaskByIdOrThrow(taskId);

    const list = await this.prismaService.list.findFirst({
      where: { AND: [{ id: task.listId, deletedAt: null }] },
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
    });

    // check if position is within range
    if (this.checkIfMoveIsValid(list.tasks, position)) {
      if (task.order > position) {
        const tasks = list.tasks.filter(
          (tsk) => tsk.order >= position && tsk.order < task.order,
        );

        await this.prismaService.$transaction([
          this.prismaService.task.updateMany({
            where: { id: { in: tasks.map((tsk) => tsk.id) } },
            data: { order: { increment: 1 } },
          }),
        ]);
      } else {
        const tasks = list.tasks.filter(
          (tsk) => tsk.order > task.order && tsk.order <= position,
        );
        await this.prismaService.$transaction([
          this.prismaService.task.updateMany({
            where: { id: { in: tasks.map((tsk) => tsk.id) } },
            data: { order: { decrement: 1 } },
          }),
        ]);
      }
      return this.prismaService.task.update({
        where: { id: taskId },
        data: { order: position },
      });
    }
    throw new HttpException(
      'Position is not within range!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getTaskByIdOrThrow(taskId: number) {
    const task = await this.prismaService.task.findFirst({
      where: { AND: [{ id: taskId, deletedAt: null }] },
    });
    if (task === null) {
      throw new NotFoundException('Task not found!');
    }
    return task;
  }

  private checkIfMoveIsValid(tasks, position: number): boolean {
    const availablePositions = tasks.map((r) => r.order);
    const maxPosition = Math.max(...availablePositions);
    return position > 0 && position <= maxPosition;
  }
}
