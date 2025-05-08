import React from "react"; 
import { Link } from "react-router-dom";
import { PAGINATION_ORDER } from "../enums/common";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sortOrder: PAGINATION_ORDER;
  setSortOrder: React.Dispatch<React.SetStateAction<PAGINATION_ORDER>>;
}

const Sidebar = ({ isOpen, onClose, sortOrder, setSortOrder }: SidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 (사이드바 외부 클릭 감지용) */}
      <div
        className="fixed inset-0 z-30 bg-black opacity-0"
        onClick={onClose}
      />

      {/* 사이드바 패널 */}
      <div
        className="fixed top-0 left-0 w-60 h-full bg-white dark:bg-gray-800 p-4 shadow-lg z-40"
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫힘 방지
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">사이드바</h3>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            to="/my"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            마이 페이지
          </Link>
          <Link
            to="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            검색
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
