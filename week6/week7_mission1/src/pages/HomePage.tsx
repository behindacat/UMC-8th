import React, { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from 'react-intersection-observer';
import Sidebar from "../components/Sidebar";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(PAGINATION_ORDER.desc);
  const { data: lps, isFetching, hasNextPage, isPending, fetchNextPage, isError } = useGetInfiniteLpList(10, search, sortOrder);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) return <div>불러오는 중...</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  console.log("LPs:", lps);  // 데이터 확인
  console.log("Pages data:", lps?.pages); // 페이지 데이터 확인

  return (
   <div className="flex container mx-auto mt-6 gap-6 px-4">
      <Sidebar
        isOpen={false}
        onClose={() => {}}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <main className="flex-1 relative pt-12">
         {/* 최신순, 오래된 순 버튼 */}
         <div className="absolute top-4 right-4 flex space-x-4 z-10">
            <button
               onClick={() => setSortOrder(PAGINATION_ORDER.asc)}
               className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
               최신순
            </button>
            <button
               onClick={() => setSortOrder(PAGINATION_ORDER.desc)}
               className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
               오래된 순
            </button>
         </div>

         {/* 검색창 + LP 카드 그리드 */}
         <div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
         {lps.pages
                    ?.map((page)=>page.data.data)
                    ?.flat()
                    ?.map((lp)=> <LpCard key={lp.id} lp={lp} />)} 
                    {isFetching && <LpCardSkeleton count={20} />}
         </div>

            <div ref={ref} className="h-10" />
         </div>
      </main>
   </div>
  );
};

export default HomePage;
