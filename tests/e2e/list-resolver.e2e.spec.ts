import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
import { PrismaService } from 'src/services/prisma.service';
import { setupTestDataset } from './setup';
import { GET_LIST_QUERY_WITH_PAGEINFO } from './queries';

const gql = '/graphql';

export const GET_PAGINATED_LIST = 'getPaginatedList';

describe('GraphQL ListsResolver (e2e) {Supertest}', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let dataService: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    dataService = setupTestDataset(prisma);
    dataService.resetData();
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
        expect(pageInfo.totalCount).toBe(15);
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
});
