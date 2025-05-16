import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { postLp } from "../../apis/Ip";

// 요청 파라미터 타입
interface PostLpParams {
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
}

// 응답 타입
interface PostLpResponse {
  id: number;
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
}

const usePostLp = (): UseMutationResult<PostLpResponse, Error, PostLpParams> => {
  return useMutation<PostLpResponse, Error, PostLpParams>({
    mutationFn: postLp,
  });
};

export default usePostLp;
