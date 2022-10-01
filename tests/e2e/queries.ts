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
  }
}`;
