import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lp: any;
  lpid: string;
}

const LpEditModal = ({ isOpen, onClose, lp, lpid }: Props) => {
  const [title, setTitle] = useState(lp.title);
  const [content, setContent] = useState(lp.content);
  const [tags, setTags] = useState(lp.tags?.join(", ") || "");
  const [thumbnail, setThumbnail] = useState(lp.thumbnail);
  const queryClient = useQueryClient();

  const { mutate: editLp, isPending } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.patch(
        `/v1/lps/${lpid}`,
        {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          thumbnail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Dialog.Panel className="bg-white rounded-xl p-6 w-[500px] text-black">
        <Dialog.Title className="text-xl font-bold mb-4">LP 수정</Dialog.Title>

        <input
          className="w-full border p-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          className="w-full border p-2 mb-3 h-24"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
        />
        <input
          className="w-full border p-2 mb-3"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그 (쉼표로 구분)"
        />
        <input
          className="w-full border p-2 mb-4"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="썸네일 URL"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={() => editLp()}
            disabled={isPending}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default LpEditModal;
