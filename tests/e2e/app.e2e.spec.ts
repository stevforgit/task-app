import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
import { PrismaService } from 'src/services/prisma.service';
import { IDataService, setupTestDataset } from './setup';
import {
  CREATE_NEW_LIST_MUTATION,
  GET_LIST_QUERY_WITH_PAGEINFO,
  ADD_TASK_TO_LIST_MUTATION,
  UPDATE_TASK_MUTATION,
} from './queries';

const gql = '/graphql';

export const GET_PAGINATED_LIST = 'getPaginatedList';
export const CREATE_NEW_LIST = 'createList';
const CREATE_TASK = 'addTaskToList';
const UPDATE_TASK = 'updateTask';

describe('GraphQL (e2e) {Supertest}', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let dataService: IDataService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    dataService = setupTestDataset(prisma);
    await dataService.resetData();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await dataService.resetData();
  });

  it('should able to get empty pagable lists', async () => {
    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: GET_PAGINATED_LIST,
        query: GET_LIST_QUERY_WITH_PAGEINFO,
        variables: { page: 1, pageSize: 10 },
      })
      .expect(200)
      .expect((res) => {
        const listData = res.body.data.getPaginatedList.lists;
        const pageInfo = res.body.data.getPaginatedList.pageInfo;
        expect(pageInfo).toBeDefined();
        expect(listData.length).toEqual(0);
        expect(pageInfo.totalCount).toBe(0);
        expect(pageInfo.hasNextPage).toBe(false);
      });
  });

  it('should able to get pagable lists', async () => {
    // Arrange
    await dataService.createMultipleList('Test Title', 15);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: GET_PAGINATED_LIST,
        query: GET_LIST_QUERY_WITH_PAGEINFO,
        variables: { page: 1, pageSize: 10 },
      })
      .expect(200)
      .expect((res) => {
        const listData = res.body.data.getPaginatedList.lists;
        const pageInfo = res.body.data.getPaginatedList.pageInfo;
        expect(pageInfo).toBeDefined();
        expect(listData).toBeDefined();
        expect(pageInfo.totalCount).toEqual(15);
        expect(pageInfo.hasNextPage).toBe(true);
      });
  });

  it('should able to get pagable lists along with tasks', async () => {
    // Arrange
    await dataService.createListWithTask('test title', 3);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: GET_PAGINATED_LIST,
        query: GET_LIST_QUERY_WITH_PAGEINFO,
        variables: { page: 1, pageSize: 10 },
      })
      .expect(200)
      .expect((res) => {
        const listData = res.body.data.getPaginatedList.lists;
        const pageInfo = res.body.data.getPaginatedList.pageInfo;
        expect(pageInfo).toBeDefined();
        expect(listData.length).toEqual(1);
        expect(listData[0].tasks).toBeDefined();
        expect(listData[0].tasks.length).toEqual(3);
        expect(pageInfo.totalCount).toBe(1);
        expect(pageInfo.hasNextPage).toBe(false);
      });
  });

  it('should able to create new list', async () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: CREATE_NEW_LIST,
        query: CREATE_NEW_LIST_MUTATION,
        variables: { title: 'test title' },
      })
      .expect(200)
      .expect((res) => {
        const createdList = res.body.data.createList;
        expect(createdList).toBeDefined();
        expect(createdList.id).toBeDefined();
        expect(createdList.title).toBeDefined();
        expect(createdList.title).toEqual('test title');
      });
  });

  it('should able to prepend task to list', async () => {
    // Arrange
    const lists = await dataService.createMultipleList('test list', 1);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: CREATE_TASK,
        query: ADD_TASK_TO_LIST_MUTATION,
        variables: { listId: lists[0].id, title: 'test task' },
      })
      .expect(200)
      .expect((res) => {
        const task = res.body.data;
        expect(task.createTask).toBeDefined();
        expect(task.createTask.order).toEqual(1);
        expect(task.createTask.completed).toBe(false);
      });
  });

  it('should able to update task status & title', async () => {
    // Arrange
    const data = await dataService.createListWithTask('test', 1);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: UPDATE_TASK,
        query: UPDATE_TASK_MUTATION,
        variables: {
          id: data.tasks[0].id,
          title: 'test updated',
          completed: true,
        },
      })
      .expect(200)
      .expect((res) => {
        const task = res.body.data;
        expect(task.updateTask).toBeDefined();
        expect(task.updateTask.title).toEqual('test updated');
        expect(task.updateTask.completed).toBe(true);
      });
  });

  it('should throw 404, when trying to update invalid task', async () => {
    // Arrange
    const data = await dataService.createListWithTask('test', 1);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: UPDATE_TASK,
        query: UPDATE_TASK_MUTATION,
        variables: {
          id: 999999999,
          title: 'test updated',
          completed: true,
        },
      })
      .expect((res) => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toEqual('Task not found!');
        expect(res.body.errors[0].extensions.code).toEqual('404');
        expect(res.body.data).toBeNull();
      });
  });

  it('should throw 400, when trying to move task to invalid position', async () => {
    // Arrange
    const data = await dataService.createListWithTask('test', 1);

    // Assert
    return request(app.getHttpServer())
      .post(gql)
      .send({
        operationName: UPDATE_TASK,
        query: UPDATE_TASK_MUTATION,
        variables: {
          id: 999999999,
          title: 'test updated',
          completed: true,
        },
      })
      .expect((res) => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toEqual('Task not found!');
        expect(res.body.errors[0].extensions.code).toEqual('404');
        expect(res.body.data).toBeNull();
      });
  });
});
