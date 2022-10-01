import { Injectable } from '@nestjs/common/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { List } from 'src/graphql/graphql';
import { Task } from '.prisma/client';
import { MoveTaskInput } from '../dto/moveTask.input';
import { UpdateTaskInput } from '../dto/updateTask.input';
import { CreateTaskInput } from '../dto/createTask.input';
import { TasksService } from 'src/services/tasks.service';

@Resolver('Task')
@Injectable()
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation('updateTask')
  async updateTask(@Args('input') args: UpdateTaskInput): Promise<List> {
    return this.tasksService.updateTask(args);
  }

  @Mutation('createTask')
  async createTask(@Args('input') args: CreateTaskInput): Promise<Task> {
    return this.tasksService.createTask(args);
  }

  @Mutation('moveTask')
  async moveTask(@Args('input') args: MoveTaskInput): Promise<Task> {
    return this.tasksService.moveTask(args);
  }
}
