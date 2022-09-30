
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

export interface UpdateList {
    id: string;
    title?: Nullable<string>;
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
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    list: List;
    listId: number;
    order: number;
}

export interface ListResult {
    edges?: Nullable<Nullable<List>[]>;
    pageInfo: PageInfo;
}

export interface PageInfo {
    totalCount?: Nullable<number>;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export interface IQuery {
    lists(page: number, pageSize: number): ListResult | Promise<ListResult>;
    list(id: string): Nullable<List> | Promise<Nullable<List>>;
}

export interface IMutation {
    createList(input?: Nullable<CreateList>): List | Promise<List>;
    updateList(input?: Nullable<UpdateList>): List | Promise<List>;
}

type Nullable<T> = T | null;
