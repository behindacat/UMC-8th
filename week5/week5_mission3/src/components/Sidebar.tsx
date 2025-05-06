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
  return (
    <div
      className={`fixed inset-0 z-40 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="fixed top-0 left-0 w-60 h-full bg-white dark:bg-gray-800 p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()} // 사이드바 클릭 시 페이지로 전파되지 않도록
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">사이드바</h3>

        <div className="mt-10">
          {/* 마이 페이지 링크 */}
          <Link
            to="/my"
            className="block text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            마이 페이지
          </Link>
        </div>
      </div>

      {/* 사이드바 외부 클릭 시 사이드바 닫기 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default Sidebar;
