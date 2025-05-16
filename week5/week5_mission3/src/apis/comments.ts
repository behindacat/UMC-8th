import axios from "axios";
import { CommentApiResponse } from "../types/comments";

export const getComments = async (
  lpid: string,
  page: number = 1
): Promise<{
  comments: CommentApiResponse["data"]["data"];
  nextPage: number | null;
}> => {
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.replace(/^"|"$/g, ""); // 따옴표 제거

  if (!token) throw new Error("인증이 필요합니다.");

  const response = await axios.get<CommentApiResponse>(
    `/v1/lps/${lpid}/comments?page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return {
    comments: response.data.data.data,
    nextPage: response.data.data.nextCursor,
  };
};
