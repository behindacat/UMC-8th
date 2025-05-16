import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { formatDistanceToNow } from "date-fns";
import LpComments from "../components/LpComments";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { Heart } from "lucide-react";
import { axiosInstance } from "../apis/axios";

// LP 상세 조회
const fetchLpDetail = async (lpid: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("인증이 필요합니다.");
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

const LpDetail = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getMyInfo();
      setUser(response);
    };
    getUserInfo();
  }, []);

  // LP 상세 데이터 가져오기
  const {
    data: lp,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => fetchLpDetail(lpid!),
    enabled: !!lpid,
  });

  const postLikeMutation = usePostLike(lpid!);
  const deleteLikeMutation = useDeleteLike(lpid!);

  const handleLike = () => {
    if (lp.isLiked) {
      deleteLikeMutation.mutate();
    } else {
      postLikeMutation.mutate();
    }
  };

  if (!lpid) return <div>잘못된 접근입니다.</div>;
  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러오지 못했습니다. {error.message}</div>;

  const formattedUpdatedAt = formatDistanceToNow(new Date(lp.updatedAt), {
    addSuffix: true,
  });

  // const isLiked = lp.likes?.some((like: any) => like.userId === user?.data?.id);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (lp && user?.data?.id) {
      const liked = lp.likes?.some((like: any) => like.userId === user.data.id);
      setIsLiked(liked);
    }
  }, [lp, user]);

  // const handleLikeClick = () => {
  //   if (lp.isLiked) {
  //     deleteLikeMutation.mutate();
  //   } else {
  //     postLikeMutation.mutate();
  //   }
  // };

  const handleLikeClick = () => {
    if (isLiked) {
      setIsLiked(false); // 낙관적 처리
      deleteLikeMutation.mutate(undefined, {
        onError: () => setIsLiked(true), // 실패 시 롤백
      });
    } else {
      setIsLiked(true);
      postLikeMutation.mutate(undefined, {
        onError: () => setIsLiked(false),
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* 작성자 정보 */}
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          {user?.data?.avatar && (
            <img
              src={user.data.avatar}
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
        
        {/* 작성자가 로그인 유저일 때만 수정/삭제 버튼 표시 */}
        {user?.data?.id === lp.authorId && (
          <div className="flex space-x-4 text-2xl cursor-pointer">
            <span title="수정" onClick={() => navigate(`/lp/edit/${lpid}`)}>✏️</span>
            <span
              title="삭제"
              onClick={() => {
                // 삭제 로직 (예: confirm 후 API 호출)
                if (window.confirm("정말 삭제하시겠습니까?")) {
                  // 삭제 API 호출 후 처리 (navigate 등)
                }
              }}
            >
              🗑️
            </span>
          </div>
        )}
      </div>


      {/* 썸네일 */}
      <div className="flex justify-center mt-20">
        <div className="relative w-72 h-72">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-72 h-72 object-cover rounded-full border-4 border-gray-700 spin"
          />
          <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-black border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-20 px-20 text-sm text-gray-300">{lp.content}</div>

      {/* 좋아요 */}
      <div className="mt-8 px-8 flex justify-center items-center space-x-4">
        <button
          onClick={handleLikeClick}
          className="text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300 border"
        >
          <Heart
            size={24}
            color={isLiked ? "red" : "white"}
            fill={isLiked ? "red" : "transparent"}
          />
        </button>
      </div>


      <LpComments lpid={lpid} />

      <div className="h-32" />
    </div>
  );
};

export default LpDetail;
