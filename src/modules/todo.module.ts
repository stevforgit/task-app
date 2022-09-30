import { Module } from '@nestjs/common';
import { ListsService } from 'src/services/lists.service';
import { PrismaService } from 'src/services/prisma.service';
import { ListsResolver } from 'src/graphql/resolvers/list.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, ListsService, ListsResolver],
  exports: [],
})
export class TodoModule {}
