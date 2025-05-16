import { useQuery } from "@tanstack/react-query";
import { RequestLpDto } from "../../types/Lp";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/Ip";

function useGetLpDetail({ lpId }: RequestLpDto) {
   return useQuery({
      queryKey:[QUERY_KEY.lps, lpId],
      queryFn: () => getLpDetail({ lpId }),
   });
}

export default useGetLpDetail;