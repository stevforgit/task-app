import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TodoModule } from './todo.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { DateScalar } from '../graphql/scalars/date.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
      },
      resolvers: {
        Date: DateScalar,
      },
      playground: true,
    }),
    EventEmitterModule.forRoot(),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
