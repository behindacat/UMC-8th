import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { getMyInfo } from "../apis/auth"; // 사용자 정보를 가져오는 API

type PAGINATION_ORDER = "asc" | "desc";

const Navbar = () => {
   const { accessToken, logout } = useAuth(); // 로그아웃 함수도 받아옴
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [sortOrder, setSortOrder] = useState<PAGINATION_ORDER>("asc");
   const [username, setUsername] = useState<string | null>(null);
   const [isMobile, setIsMobile] = useState(false); // 화면 크기 추적
   const [windowWidth, setWindowWidth] = useState(window.innerWidth); // 화면 크기 추적

   // useEffect에서 API를 호출해 username을 가져옴
   useEffect(() => {
      const handleResize = () => {
        const newWidth = window.innerWidth;
        setWindowWidth(newWidth);
    
        // 예: 데스크탑에서 창이 1024px 이하로 줄어들면 사이드바 닫기
        if (newWidth <= 1024 && sidebarOpen) {
          setSidebarOpen(false);
        }
      };
    
      window.addEventListener("resize", handleResize);
      handleResize(); // 초기 실행
      return () => window.removeEventListener("resize", handleResize);
    }, [sidebarOpen]);
    
    

   const handleLogout = () => {
      logout(); // 로그아웃 함수 호출
      setUsername(null);  // 로그아웃 시 username 초기화
   };

   // 사이드바 열기/닫기 처리 (아이콘 클릭 시만)
   const handleSidebarToggle = () => {
      setSidebarOpen(prevState => !prevState); // 사이드바 열기/닫기 토글
   };

   return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 left-0">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {/* 화면 크기에 관계없이 사이드바 아이콘은 항상 보이게 함 */}
            <button
               onClick={handleSidebarToggle}
               className="text-gray-700 dark:text-white focus:outline-none"
            >
               <Menu className="w-6 h-6" />
            </button>
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              돌려돌려 LP판
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* 로그인 상태에 따라 다른 링크 표시 */}
            {accessToken ? (
              <>
                <div className="text-gray-700 dark:text-gray-300">
                  {/* 사용자 이름을 가져와서 환영합니다 문구 표시 */}
                  {username && <span>{username}님, 환영합니다!</span>}
                </div>
                <Link
                  to={"/search"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  검색
                </Link>
                {/* 로그아웃 버튼 */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  로그인
                </Link>
                <Link
                  to={"/signup"}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 사이드바 (왼쪽에서 나타나는 형태로 수정) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </>
  );
};

export default Navbar;
