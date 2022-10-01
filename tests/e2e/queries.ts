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
