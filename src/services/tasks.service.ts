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
          select: { id: true },
          where: {
            deletedAt: null,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (list === null) {
      throw new NotFoundException('List id not found!');
    }

    if (list.tasks.length > 0) {
      const taskIds = list.tasks.map((task) => task.id);

      const transactions = await this.prismaService.$transaction([
        this.prismaService.task.updateMany({
          where: { id: { in: [...taskIds] } },
          data: { order: { increment: 1 } },
        }),
        this.prismaService.task.create({
          data: { listId: listId, title: title, order: 1 },
        }),
      ]);
      return transactions[1];
    }
    return this.prismaService.task.create({
      data: { listId: listId, title: title, order: 1 },
    });
  }

  async updateTask(data: UpdateTaskInput): Promise<Task> {
    const { id, title, completed } = data;
    const task = await this.getTaskByIdOrThrow(id);
    return this.prismaService.task.update({
      where: {
        id: task.id,
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

    // Get list with tasks
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

    // check if position is within range, move is valid or not.
    if (this.checkIfMoveIsValid(list.tasks, position)) {
      if (task.order > position) {
        const tasks = list.tasks.filter(
          (tsk) => tsk.order >= position && tsk.order < task.order,
        );

        return await this.rearrangeTasksOrder(
          taskId,
          position,
          tasks.map((tsk) => tsk.id),
          { order: { increment: 1 } },
        );
      } else {
        const tasks = list.tasks.filter(
          (tsk) => tsk.order > task.order && tsk.order <= position,
        );
        return await this.rearrangeTasksOrder(
          taskId,
          position,
          tasks.map((tsk) => tsk.id),
          { order: { decrement: 1 } },
        );
      }
    }
    throw new HttpException(
      'Position is not within range!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getTaskByIdOrThrow(taskId: number): Promise<Task> {
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

  private async rearrangeTasksOrder(
    taskId: number,
    targetPosition,
    taskIds: number[],
    updateManyData,
  ) {
    // Unit of work, perform batch update on tasks order.
    const $transactions = await this.prismaService.$transaction([
      this.prismaService.task.updateMany({
        where: { id: { in: taskIds } },
        data: updateManyData,
      }),
      this.prismaService.task.update({
        where: { id: taskId },
        data: { order: targetPosition },
      }),
    ]);
    return $transactions[1];
  }
}
