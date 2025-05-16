import { PaginationDto } from "../types/common";
import {
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpDto,
  ResponseLpListDto,
} from "../types/Lp";
import { axiosInstance } from "./axios";
import customAxios from "./customAxios";

// LP 목록 조회
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

// LP 상세 조회
export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

// 좋아요 추가
export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

// 좋아요 제거
export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

// LP 생성 관련 타입
export interface PostLpParams {
  title: string;
  content: string;
  tags: string[];
  thumbnail: string; // base64 or image url
}

export interface PostLpResponse {
  id: number;
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
}

// LP 생성 요청
export const postLp = async (
  data: PostLpParams
): Promise<PostLpResponse> => {
  const response = await customAxios.post("/lp", data);
  return response.data;
};

