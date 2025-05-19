import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "../apis/comments";
import { CommentData } from "../types/comments";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

const CommentSkeleton = () => (
  <div className="flex items-start gap-4 bg-gray-700 p-3 rounded-lg animate-pulse mt-5">
    <div className="w-10 h-10 bg-gray-600 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-600 rounded w-1/4" />
      <div className="h-3 bg-gray-600 rounded w-full" />
      <div className="h-3 bg-gray-600 rounded w-1/2" />
    </div>
  </div>
);

interface LpCommentsProps {
  lpid: string;
}

const LpComments = ({ lpid }: LpCommentsProps) => {
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("oldest");
  const [user, setUser] = useState<ResponseMyInfoDto | null>(null);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getMyInfo();
      setUser(result);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-button") && !target.closest(".menu-popup")) {
        setOpenedMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const {
    data: commentPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", lpid, sortOrder],
    queryFn: ({ pageParam = 1 }) => getComments(lpid!, pageParam, sortOrder),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!lpid,
  });

  useEffect(() => {
    setComments([]);
    queryClient.removeQueries({ queryKey: ["comments", lpid, sortOrder] });
  }, [sortOrder, lpid, queryClient]);

  useEffect(() => {
    if (!commentPages) return;
    const allComments = commentPages.pages.flatMap((page) => page.comments);
    setComments(allComments);
  }, [commentPages]);

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
  }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const maxId = comments.length > 0 ? Math.max(...comments.map((c) => c.id)) : 0;

    const newCommentObj: CommentData = {
      id: maxId + 1,
      content: newComment.trim(),
      author: {
        id: user?.data.id ?? -1,
        name: user?.data.name ?? "익명",
      },
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleSaveEdit = () => {
    if (editingId === null) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, content: editingContent } : c
      )
    );
    setEditingId(null);
    setEditingContent("");
  };

  const handleDelete = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingContent("");
    }
  };

  return (
    <div className="mt-20 px-8">
      <div className="flex justify-between items-center mb-4">
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

      <div className="flex items-center gap-2 mb-4">
        <textarea
          className="flex-1 h-12 px-4 bg-gray-900 text-white border border-gray-600 rounded resize-none leading-[48px] placeholder-gray-400 overflow-hidden"
          placeholder="댓글을 입력해주세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="h-12 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
        >
          작성
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="relative flex items-start gap-4 bg-gray-700 p-3 rounded-lg text-sm text-white"
          >
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
              {comment.author?.name?.[0]}
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between relative">
                <span className="font-semibold">{comment.author?.name}</span>
                {user?.data.id === comment.author?.id && (
                  <div className="relative">
                    <button
                      className="menu-button text-white text-xl px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenedMenuId((prev) =>
                          prev === comment.id ? null : comment.id
                        );
                      }}
                    >
                      …
                    </button>
                    {openedMenuId === comment.id && (
                      <div className="menu-popup absolute right-0 mt-1 w-20 bg-gray-800 border border-gray-600 rounded z-10 shadow-md">
                        <button
                          className="w-full text-left px-3 py-1 hover:bg-gray-700"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditingContent(comment.content);
                            setOpenedMenuId(null);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="w-full text-left px-3 py-1 hover:bg-gray-700"
                          onClick={() => {
                            handleDelete(comment.id);
                            setOpenedMenuId(null);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-1">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-2 bg-gray-800 rounded"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      className="text-sm text-yellow-400"
                      onClick={handleSaveEdit}
                    >
                      저장
                    </button>
                    <button
                      className="text-sm text-gray-400"
                      onClick={() => setEditingId(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 whitespace-pre-wrap">{comment.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`sk-${i}`} />)}
    </div>
  );
};

export default LpComments;
