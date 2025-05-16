import { useParams } from "react-router-dom";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { formatDistanceToNow } from "date-fns";
import { getComments } from "../apis/comments";
import { CommentData } from "../types/comments";

// LP 상세 조회
const fetchLpDetail = async (lpid: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("인증이 필요합니다.");
  const { data } = await axios.get(`/v1/lps/${lpid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

// 💡 댓글 스켈레톤 컴포넌트
const CommentSkeleton = () => (
  <div className="flex items-start gap-4 bg-gray-700 p-3 rounded-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-600 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-600 rounded w-1/4" />
      <div className="h-3 bg-gray-600 rounded w-full" />
      <div className="h-3 bg-gray-600 rounded w-1/2" />
    </div>
  </div>
);

const LpDetail = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("oldest");
  const observerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 사용자 정보
  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getMyInfo();
      setUser(response);
    };
    getUserInfo();
  }, []);

  // LP 상세
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

  // 댓글 무한스크롤
  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["comments", lpid, sortOrder],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getComments(lpid!, pageParam);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!lpid,
  });

  useEffect(() => {
    console.log("📦 commentPages 전체", commentPages);
    if (commentPages) {
      commentPages.pages.forEach((page, idx) => {
        console.log(`📄 Page ${idx + 1}:`, page.comments);
      });
    }
  }, [commentPages]);

  // 댓글 정렬 변경 시 쿼리 제거 후 새로 fetch
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["comments", lpid] });
  }, [sortOrder]);

  // 무한 스크롤 감지
  useEffect(() => {
    const el = observerRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [observerRef.current, hasNextPage, isFetchingNextPage]);

  if (!lpid) return <div>잘못된 접근입니다.</div>;
  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>데이터를 불러오지 못했습니다. {error.message}</div>;

  const formattedUpdatedAt = formatDistanceToNow(new Date(lp.updatedAt), {
    addSuffix: true,
  });

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
        <div className="flex space-x-4 text-2xl cursor-pointer">
          <span title="수정">✏️</span>
          <span title="삭제">🗑️</span>
        </div>
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
        <button className="bg-white-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-500 transition duration-300">
          👍 1
        </button>
      </div>

      {/* 댓글 작성란 */}
      <div className="mt-20 px-8">
        {/* 정렬 버튼 */}
        <div className="flex justify-between items-center mt-6 mb-2">
          <h2 className="text-xl font-bold">댓글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder("latest")}
              className={`px-3 py-1 rounded ${
                sortOrder === "latest"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-white"
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder("oldest")}
              className={`px-3 py-1 rounded ${
                sortOrder === "oldest"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-700 text-white"
              }`}
            >
              오래된 순
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <textarea
            className="flex-1 h-12 px-4 bg-gray-900 text-white border border-gray-600 rounded resize-none leading-[48px] placeholder-gray-400 overflow-hidden"
            placeholder="댓글을 입력해주세요"
            disabled
          />
          <button className="h-12 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded">
            작성
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4 mt-4">
          {!commentPages
            ? Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
              ))
            : commentPages.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.comments.map((comment: CommentData) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-4 bg-gray-700 p-3 rounded-lg text-sm text-white"
                    >
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.author?.name?.[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">
                          {comment.author?.name}
                        </div>
                        <div>{comment.content}</div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
        </div>

        {/* 스크롤 감지용 요소 */}
        <div ref={observerRef} className="h-10" />

        {/* 다음 페이지 로딩 스켈레톤 */}
        {isFetchingNextPage && (
          <div className="space-y-4 mt-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <CommentSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}
      </div>

      <div className="h-32" />
    </div>
  );
};

export default LpDetail;
