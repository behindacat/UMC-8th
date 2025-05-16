import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteLike = async (lpid: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const { data } = await axios.delete(`/v1/lps/${lpid}/likes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const useDeleteLike = (lpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLike(lpid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
    },
  });
};

export default useDeleteLike;
