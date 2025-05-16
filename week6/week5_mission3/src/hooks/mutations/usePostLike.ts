import { useMutation, useQueryClient } from "@tanstack/react-query";
import {axiosInstance} from "../../apis/axios";

const postLike = async (lpid: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const { data } = await axiosInstance.post(
    `/v1/lps/${lpid}/likes`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

const usePostLike = (lpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postLike(lpid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });
};

export default usePostLike;
