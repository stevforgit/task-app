import { PrismaService } from 'src/services/prisma.service';

export interface IDataService {
  resetData();
  createMultipleList(title: string, count: number);
  createListWithTask(title: string, taskCount: number);
}

export const setupTestDataset = (prisma: PrismaService) => {
  return {
    resetData: async () => {
      await prisma.task.deleteMany({});
      await prisma.list.deleteMany({});
    },
    createMultipleList: async (title: string, count: number) => {
      for (let i = 0; i < count; i++) {
        await prisma.list.create({ data: { title: `${title}-${i}` } });
      }
    },
    createListWithTask: async (title: string, taskCount: number) => {
      const list = await prisma.list.create({
        data: { title: `${title}` },
      });
      for (let i = 0; i < taskCount; i++) {
        await prisma.task.create({
          data: { title: `${title}-${i}`, order: i + 1, listId: list.id },
        });
      }
    },
  };
};
