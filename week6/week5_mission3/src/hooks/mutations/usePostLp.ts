import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { postLp } from "../../apis/Ip";
import { PostLpParams } from "../../apis/Ip";

// 응답 타입
interface PostLpResponse {
  id: number;
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
}

const usePostLp = (): UseMutationResult<
  PostLpResponse,
  Error,
  PostLpParams
> => {
  return useMutation<PostLpResponse, Error, PostLpParams>({
    mutationFn: postLp,
  });
};

export default usePostLp;
