export const GET_LIST_QUERY_WITH_PAGEINFO = `query getPaginatedList($page: Int!, $pageSize: Int!) {
    getPaginatedList(page: $page, pageSize: $pageSize) {
        pageInfo{
            totalCount
            hasNextPage
          }
        lists{
            id
            title
            tasks {
                id
                title
                order
                completed
            }
        }
  }
}`;

export const CREATE_NEW_LIST_MUTATION = `mutation createList($title: String!) {
    createList(input:{
        title:$title
      }) {
        id
        title
        createdAt
        updatedAt
  }
}`;

export const ADD_TASK_TO_LIST_MUTATION = `
mutation addTaskToList($listId: Int!, $title: String!) {
  createTask(input:{
    listId:$listId, title:$title
  })
  {
    id
    title
    order
    completed
  }
}`;

export const UPDATE_TASK_MUTATION = `
mutation updateTask($id: Int, $title: String!, $completed: Boolean!) {
  updateTask(input:{
    id:$id, title:$title, completed: $completed
  })
  {
    id
    title
    order
    completed
  }
}`;
