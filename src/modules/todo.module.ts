import { Module } from '@nestjs/common';
import { ListsService } from 'src/services/lists.service';
import { PrismaService } from 'src/services/prisma.service';
import { ListsResolver } from 'src/graphql/resolvers/list.resolver';
import { TasksResolver } from 'src/graphql/resolvers/task.resolver';
import { TasksService } from 'src/services/tasks.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    ListsService,
    TasksService,
    ListsResolver,
    TasksResolver,
  ],
  exports: [],
})
export class TodoModule {}
