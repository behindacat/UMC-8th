import {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

// 프로필 수정 함수
export const updateProfile = async (updateData: {
  name: string;
  bio?: string;
  avatar?: string;
}) => {
  try {
    const { data } = await axiosInstance.patch("/v1/users", updateData);
    return data;
  } catch (error: any) {
    console.error(
      "프로필 업데이트 에러 응답:",
      error.response?.data || error.message
    );
    throw new Error("프로필 업데이트 실패");
  }
};

// 탈퇴하기 API 함수 (서버 API 문서에 따라 경로/메서드 조정 필요)
export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete("/v1/users");
  return data;
};
