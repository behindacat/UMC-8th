import React, { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import Sidebar from "../components/Sidebar";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import MyPageLpAddModal from "../components/MyPageLpAddModal";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, search, sortOrder);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Sidebar 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LP 추가 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    // 모달 닫힐 때 입력 값 초기화도 가능
    setLpName("");
    setLpContent("");
    setTags([]);
    setTagInput("");
    setPreviewImg(null);
  };

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 p-6 bg-gray-900 min-h-screen text-white">
        {/* 검색 및 정렬 영역 */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="검색"
            className="rounded px-4 py-2 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as PAGINATION_ORDER)}
            className="rounded px-3 py-2 bg-gray-700 text-white"
          >
            <option value={PAGINATION_ORDER.desc}>최신순</option>
            <option value={PAGINATION_ORDER.asc}>오래된 순</option>
          </select>
        </div>

        {/* LP 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lps?.pages
            .flatMap((page) =>
              page.data.data.map((lp) => <LpCard key={lp.id} lp={lp} />)
            )}

          {isFetching &&
            Array.from({ length: 3 }).map((_, idx) => <LpCardSkeleton key={idx} />)}
        </div>

        {/* 무한 스크롤 감지 div (높이 1px 이상 주기) */}
        <div ref={ref} style={{ height: "1px" }} />

        {isError && <p className="text-red-500 mt-4">에러가 발생했습니다.</p>}

        {/* LP 추가 모달 오픈 버튼 */}
        <button
          className="fixed bottom-20 right-20 bg-pink-500 hover:bg-pink-600 text-white text-3xl w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 z-50"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add LP"
        >
          +
        </button>

        {isModalOpen && (
          <MyPageLpAddModal
            onClose={handleModalClose}
            lpName={lpName}
            setLpName={setLpName}
            lpContent={lpContent}
            setLpContent={setLpContent}
            tags={tags}
            setTags={setTags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            previewImg={previewImg}
            setPreviewImg={setPreviewImg}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
