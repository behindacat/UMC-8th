import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { getMyInfo, postLogout } from "../apis/auth";
import { PAGINATION_ORDER } from "../enums/common";

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.asc);
  const [username, setUsername] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (accessToken) {
      const fetchUsername = async () => {
        try {
          const response = await getMyInfo();
          if (response && response.data?.name) {
            setUsername(response.data.name);
          }
        } catch (error) {
          console.error("유저 정보 가져오기 실패:", error);
          setUsername(null);
        }
      };
      fetchUsername();
    } else {
      setUsername(null);
    }
  }, [accessToken]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      if (newWidth <= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // postLogout API 함수 사용
  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      logout(); // AuthContext 내 로그아웃 처리 (토큰 초기화 등)
      setUsername(null);
      setSidebarOpen(false);
    },
    onError: (error) => {
      alert("로그아웃에 실패했습니다.");
      console.error(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 left-0">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSidebarToggle}
              className="text-gray-700 dark:text-white focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              돌려돌려 LP판
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {accessToken ? (
              <>
                <div className="text-gray-700 dark:text-gray-300">
                  {username && <span>{username}님, 환영합니다!</span>}
                </div>
                <Link
                  to="/my"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                >
                  마이페이지
                </Link>
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
