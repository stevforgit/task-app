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
      const lists = [];
      for (let i = 0; i < count; i++) {
        const list = await prisma.list.create({
          data: { title: `${title}-${i}` },
        });
        lists.push(list);
      }
      return lists;
    },
    createListWithTask: async (title: string, taskCount: number) => {
      const tasks = [];
      const list = await prisma.list.create({
        data: { title: `List ${title}` },
      });
      for (let i = 0; i < taskCount; i++) {
        const task = await prisma.task.create({
          data: { title: `Task ${title}-${i}`, order: i + 1, listId: list.id },
        });
        tasks.push(task);
      }
      return {
        list,
        tasks,
      };
    },
  };
};
