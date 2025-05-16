import React, { useRef } from "react";
import LpImg from "../image/lp.png";
import usePostLp from "../hooks/mutations/usePostLp";

interface MyPageLpAddModalProps {
  onClose: () => void;
  lpName: string;
  setLpName: React.Dispatch<React.SetStateAction<string>>;
  lpContent: string;
  setLpContent: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  previewImg: string | null;
  setPreviewImg: React.Dispatch<React.SetStateAction<string | null>>;
}

const MyPageLpAddModal: React.FC<MyPageLpAddModalProps> = ({
  onClose,
  lpName,
  setLpName,
  lpContent,
  setLpContent,
  tags,
  setTags,
  tagInput,
  setTagInput,
  previewImg,
  setPreviewImg,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    mutate: postLpMutate,
    isPending,
    isError,
  } = usePostLp();

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostLp = () => {
    if (!lpName.trim() || !lpContent.trim() || !previewImg) {
      alert("LP 이름, 내용, 썸네일을 모두 입력해주세요.");
      return;
    }

    postLpMutate(
      {
        title: lpName,
        content: lpContent,
        tags,
        thumbnail: previewImg,
      },
      {
        onSuccess: () => {
          alert("LP가 성공적으로 등록되었습니다!");
          onClose();
        },
        onError: (error) => {
          console.log("LP 등록 에러:", error);
          alert("LP 등록 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 relative">
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-black text-3xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* 이미지 업로드 영역 */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-60 h-40">
            {previewImg && (
              <img
                src={previewImg}
                alt="업로드된 LP 썸네일"
                onClick={handleFileClick}
                className="w-40 h-40 object-cover absolute left-0 top-0 z-20 cursor-pointer rounded"
              />
            )}
            <img
              src={LpImg}
              alt="기본 LP 썸네일"
              onClick={handleFileClick}
              className={`w-40 h-40 object-cover cursor-pointer rounded absolute top-0 z-10 transition-all duration-300 ${
                previewImg ? "right-[-24px]" : "left-1/2 -translate-x-1/2"
              } ${previewImg ? "" : "hover:opacity-80"}`}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              aria-label="Upload LP thumbnail"
            />
          </div>
        </div>

        {/* LP 제목 입력 */}
        <div className="mb-4">
          <input
            type="text"
            value={lpName}
            onChange={(e) => setLpName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black"
            placeholder="LP Name"
            name="lpName"
          />
        </div>

        {/* LP 내용 입력 */}
        <div className="mb-4">
          <input
            type="text"
            value={lpContent}
            onChange={(e) => setLpContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-black"
            placeholder="LP Content"
            name="lpContent"
          />
        </div>

        {/* 태그 입력 */}
        <div className="mb-4">
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              placeholder="Lp Tag"
              name="tagInput"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="ml-2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Add
            </button>
          </div>

          <div className="mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 rounded-full mr-2 mt-2 border border-gray-300 text-black"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-gray-400 hover:text-black"
                  aria-label={`Remove tag ${tag}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* LP 등록 버튼 */}
        <button
          type="button"
          onClick={handlePostLp}
          disabled={isPending}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-60"
        >
          {isPending ? "등록 중..." : "Add LP"}
        </button>

        {/* 에러 메시지 */}
        {isError && (
          <p className="text-red-500 text-center mt-2">
            LP 등록 중 오류가 발생했습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyPageLpAddModal;
