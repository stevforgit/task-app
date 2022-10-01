
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateList {
    title?: Nullable<string>;
}

export interface UpdateTask {
    id?: Nullable<number>;
    title: string;
    completed: boolean;
}

export interface CreateTask {
    listId?: Nullable<number>;
    title?: Nullable<string>;
}

export interface MoveTask {
    taskId?: Nullable<number>;
    position?: Nullable<number>;
}

export interface List {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    tasks?: Nullable<Task[]>;
}

export interface Task {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    list: List;
    listId: number;
    order: number;
    completed: boolean;
}

export interface ListResult {
    lists?: Nullable<List[]>;
    pageInfo: PageInfo;
}

export interface PageInfo {
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export interface IQuery {
    getPaginatedList(page: number, pageSize: number): ListResult | Promise<ListResult>;
}

export interface IMutation {
    createList(input?: Nullable<CreateList>): List | Promise<List>;
    updateTask(input?: Nullable<UpdateTask>): Task | Promise<Task>;
    createTask(input?: Nullable<CreateTask>): Task | Promise<Task>;
    moveTask(input?: Nullable<MoveTask>): Task | Promise<Task>;
}

type Nullable<T> = T | null;
