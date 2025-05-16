import React, { useRef, useEffect } from "react";
import usePostLp from "../hooks/mutations/usePostLp";
import useEditLp from "../hooks/mutations/useEditLp"; // 수정용 훅 가정
import useDeleteLp from "../hooks/mutations/useDeleteLp"; // 삭제용 훅 가정

interface LpData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  thumbnail: string | null;
  authorId: string;
}

interface MyPageLpAddModalProps {
  onClose: () => void;
  // 수정 모드인지 여부
  isEditMode?: boolean;
  // 수정 시 기존 LP 데이터
  existingLp?: LpData;
  // 로그인한 유저 아이디
  currentUserId: string;

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
  isEditMode = false,
  existingLp,
  currentUserId,

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

  // 등록, 수정, 삭제 훅
  const { mutate: postLpMutate, isLoading: isPosting, isError: isPostError } = usePostLp();
  const { mutate: editLpMutate, isLoading: isEditing, isError: isEditError } = useEditLp();
  const { mutate: deleteLpMutate, isLoading: isDeleting, isError: isDeleteError } = useDeleteLp();

  // 수정 모드일 때 기존 데이터 초기화
  useEffect(() => {
    if (isEditMode && existingLp) {
      setLpName(existingLp.title);
      setLpContent(existingLp.content);
      setTags(existingLp.tags);
      setPreviewImg(existingLp.thumbnail);
    }
  }, [isEditMode, existingLp, setLpName, setLpContent, setTags, setPreviewImg]);

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

  const validateInputs = () => {
    if (!lpName.trim() || !lpContent.trim() || !previewImg) {
      alert("LP 이름, 내용, 썸네일을 모두 입력해주세요.");
      return false;
    }
    return true;
  };

  const handlePostLp = () => {
    if (!validateInputs()) return;

    const payload = {
      title: lpName,
      content: lpContent,
      tags,
      thumbnail: previewImg,
      published: true,
    };

    postLpMutate(payload, {
      onSuccess: () => {
        alert("LP가 성공적으로 등록되었습니다!");
        onClose();
      },
      onError: (error) => {
        console.error("LP 등록 에러:", error);
        alert("LP 등록 중 오류가 발생했습니다.");
      },
    });
  };

  const handleEditLp = () => {
    if (!validateInputs() || !existingLp) return;

    const payload = {
      id: existingLp.id,
      title: lpName,
      content: lpContent,
      tags,
      thumbnail: previewImg,
      published: true,
    };

    editLpMutate(payload, {
      onSuccess: () => {
        alert("LP가 성공적으로 수정되었습니다!");
        onClose();
      },
      onError: (error) => {
        console.error("LP 수정 에러:", error);
        alert("LP 수정 중 오류가 발생했습니다.");
      },
    });
  };

  const handleDeleteLp = () => {
    if (!existingLp) return;
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteLpMutate(existingLp.id, {
        onSuccess: () => {
          alert("LP가 삭제되었습니다.");
          onClose();
        },
        onError: (error) => {
          console.error("LP 삭제 에러:", error);
          alert("LP 삭제 중 오류가 발생했습니다.");
        },
      });
    }
  };

  // 수정 가능 여부 판단 (작성자만 수정 가능)
  const canModify = isEditMode && existingLp && currentUserId === existingLp.authorId;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-black text-3xl"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isPosting || isEditing || isDeleting}
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUP_crkBeolP0iN7AIi6_wyhIXXqD7R-UElw&s"
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
              disabled={isPosting || isEditing || isDeleting}
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
            disabled={isPosting || isEditing || isDeleting}
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
            disabled={isPosting || isEditing || isDeleting}
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
              disabled={isPosting || isEditing || isDeleting}
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="ml-2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={isPosting || isEditing || isDeleting}
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
                  className="ml-1 text-gray-400 hover:text-gray-600"
                  aria-label={`Remove tag ${tag}`}
                  disabled={isPosting || isEditing || isDeleting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center mt-8 gap-5">
          {!isEditMode && (
            <button
              type="button"
              onClick={handlePostLp}
              className="btn btn-primary px-6 py-3 rounded-xl"
              disabled={isPosting}
            >
              {isPosting ? "등록 중..." : "등록"}
            </button>
          )}

          {isEditMode && (
            <>
              <button
                type="button"
                onClick={handleEditLp}
                className="btn btn-primary px-6 py-3 rounded-xl"
                disabled={!canModify || isEditing}
                title={canModify ? "" : "수정 권한이 없습니다."}
              >
                {isEditing ? "수정 중..." : "수정"}
              </button>

              <button
                type="button"
                onClick={handleDeleteLp}
                className="btn btn-secondary px-6 py-3 rounded-xl"
                disabled={!canModify || isDeleting}
                title={canModify ? "" : "삭제 권한이 없습니다."}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageLpAddModal;
