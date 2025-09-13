import { groupList } from "@/api/group";
import { QUERY_KEYS } from "@/constants";
import { SearchParams } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

function useGroupListPaging(searchParams: SearchParams) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => groupList({ ...searchParams, page: pageParam }),
    queryKey: [QUERY_KEYS.GROUP, QUERY_KEYS.GROUP_PAGING, searchParams],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      //const lastPost = lastPage[lastPage.length - 1];
      //return lastPost ? allPages.length + 1 : undefined;
      return undefined;
    },
  });
}

export default useGroupListPaging;
