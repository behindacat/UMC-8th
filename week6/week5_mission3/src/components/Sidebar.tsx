import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // sortOrder, setSortOrder는 현재 미사용이라 제거하거나 필요시 다시 추가하세요
  // sortOrder: PAGINATION_ORDER;
  // setSortOrder: React.Dispatch<React.SetStateAction<PAGINATION_ORDER>>;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const deleteMutation = useMutation<void, Error>({
    mutationFn: deleteAccount,
    onSuccess: () => {
      setShowConfirmModal(false);
      onClose();
      navigate("/login");
    },
    onError: (error) => {
      alert("탈퇴에 실패했습니다.");
      console.error(error);
    },
  });

  const handleDeleteAccount = () => {
    console.log("회원 탈퇴가 진행됩니다.");
    deleteMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black opacity-0" onClick={onClose} />
      <div
        className="fixed top-0 left-0 w-60 h-full bg-white dark:bg-gray-800 p-4 shadow-lg z-40"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">사이드바</h3>

        <div className="mt-10 flex flex-col gap-4">
          <Link to="/my" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            마이 페이지
          </Link>
          <Link to="/search" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            검색
          </Link>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-700 p-6 rounded shadow-md w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white text-2xl"
              onClick={() => setShowConfirmModal(false)}
            >
              ✕
            </button>
            <p className="text-lg text-gray-800 dark:text-white mt-7 mb-4 text-center">
              정말 탈퇴하시겠어요?
            </p>
            <div className="flex mt-7 justify-center gap-4">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                예
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
