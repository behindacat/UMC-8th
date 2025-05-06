import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { formatDistanceToNow } from 'date-fns';

// LP 데이터 가져오는 함수
const fetchLpDetail = async (lpid: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("인증이 필요합니다.");
  const { data } = await axios.get(`/v1/lps/${lpid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

const LpDetail = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  const { data: lp, isLoading, isError, error } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => fetchLpDetail(lpid!),
    enabled: !!lpid,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getMyInfo();
      setUser(response);
    };
    getUserInfo();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) {
    console.log("Error:", error);
    return <div>데이터를 불러오지 못했습니다. {error.message}</div>;
  }

  const formattedUpdatedAt = formatDistanceToNow(new Date(lp.updatedAt), { addSuffix: true });

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* 작성자 정보 */}
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          {user?.data?.avatar && (
            <img
              src={user.data.avatar as string}
              alt="사용자 이미지"
              className="w-10 h-10 rounded-full"
            />
          )}
          <span className="text-lg font-semibold">{user?.data?.name}</span>
        </div>
        <span className="text-sm text-gray-400">{formattedUpdatedAt}</span>
      </div>


      {/* LP 제목 */}
      <div className="flex justify-between items-center mt-8 px-8">
        <h1 className="text-3xl font-bold text-left">{lp.title}</h1>
        <div className="flex space-x-4 text-2xl cursor-pointer">
          <span title="수정">✏️</span>
          <span title="삭제">🗑️</span>
        </div>
      </div>


      {/* LP 썸네일 이미지 */}
      <div className="flex justify-center mt-20">
        <div className="relative w-72 h-72">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-72 h-72 object-cover rounded-full border-4 border-gray-700 spin"
          />
          {/* CD 구멍 (중앙 동그라미) */}
          <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-black border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
        </div>

      </div>

      {/* LP 설명 */}
      <div className="mt-20 px-20 text-sm text-gray-300">{lp.content}</div>

      <div className="mt-8 px-8 flex justify-center items-center space-x-4">
        <button
          className="bg-white-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300">
          👍 1
        </button>
      </div>
      <div className="h-20"></div>

    </div>
  );
};

export default LpDetail;
