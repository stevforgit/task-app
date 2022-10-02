
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
    id: number;
    title?: Nullable<string>;
    completed?: Nullable<boolean>;
}

export interface CreateTask {
    listId: number;
    title: string;
}

export interface MoveTask {
    taskId: number;
    position: number;
}

export interface List {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    tasks?: Nullable<Task[]>;
}

export interface Task {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
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
    getPaginatedList(page?: Nullable<number>, pageSize?: Nullable<number>): ListResult | Promise<ListResult>;
}

export interface IMutation {
    createList(input?: Nullable<CreateList>): List | Promise<List>;
    createTask(input?: Nullable<CreateTask>): Task | Promise<Task>;
    updateTask(input?: Nullable<UpdateTask>): Task | Promise<Task>;
    moveTask(input?: Nullable<MoveTask>): Task | Promise<Task>;
}

type Nullable<T> = T | null;
