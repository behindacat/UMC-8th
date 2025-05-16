import { useEffect, useState, useRef } from "react";
import { getMyInfo, updateProfile } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import MyPageLpAddModal from "../components/MyPageLpAddModal";
import { getLpList } from "../apis/Ip"; 
import { Lp, ResponseLpListDto } from "../types/Lp";
import { PaginationDto } from "../types/common";


const MyPage = () => {
  const navigate = useNavigate();
  const { logout, updateUserInfo } = useAuth();

  const [data, setData] = useState<ResponseMyInfoDto>({} as ResponseMyInfoDto);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [myLps, setMyLps] = useState<Lp[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
        setEditName(response.data.name);
        setEditBio(response.data.bio || "");
        setEditImage(response.data.avatar || null);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };
    getData();
  }, []);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      try {
        const refreshed = await getMyInfo();
        setData(refreshed);
        updateUserInfo(refreshed.data);
        setIsEditOpen(false);
        alert("프로필이 성공적으로 업데이트 되었습니다.");
      } catch (error) {
        console.error("업데이트 후 정보 재요청 실패:", error);
      }
    },
    onError: (error) => {
      console.error("프로필 업데이트 실패:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      alert("닉네임은 비워둘 수 없습니다.");
      return;
    }

    // Optimistic UI 적용
    setData({
      ...data,
      data: {
        ...data.data,
        name: editName,
        bio: editBio,
        avatar: editImage ?? null,
      },
    });

    updateUserInfo({
      ...data.data,
      name: editName,
      bio: editBio,
      avatar: editImage ?? null,
    });

    mutation.mutate({
      name: editName,
      bio: editBio,
      avatar: editImage ?? undefined,
    });

    const params = {
      cursor: undefined,
      limit: 10,
    };

    // 내 LP 목록 불러오기 (페이징 예시: page=1, size=10)
    const fetchMyLps = async () => {
      const params: PaginationDto = {
        cursor: undefined, // null이 아닌 undefined로 설정하세요 (아래 설명 참고)
        limit: 10,
      };

      try {
        const response: ResponseLpListDto = await getLpList(params);
        setMyLps(response.data.data); // response.data는 Lp[] 타입
      } catch (error) {
        console.error("내 LP 목록 로드 실패:", error);
      }
    };
    fetchMyLps();
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="relative bg-gray-900 p-6 rounded-xl shadow-md w-full max-w-md flex items-center gap-6">
        <div
          className={`w-24 h-24 rounded-full border border-gray-300 bg-gray-700 flex items-center justify-center overflow-hidden
            ${isEditOpen ? "cursor-pointer" : ""}
          `}
          onClick={isEditOpen ? handleFileClick : undefined}
        >
          {(isEditOpen ? editImage : data.data?.avatar) ? (
            <img
              src={isEditOpen ? editImage ?? undefined : data.data?.avatar ?? undefined}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">{isEditOpen ? "없음" : "No Image"}</span>
          )}

          {isEditOpen && (
            <input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 relative text-left">
          {!isEditOpen && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">{data.data?.name}</h1>
              <p className="text-gray-300 text-sm mb-1">
                {data.data?.bio ? data.data.bio : "바이오가 없습니다"}
              </p>
              <p className="text-gray-400 text-sm">{data.data?.email}</p>

              <button
                onClick={() => setIsEditOpen(true)}
                className="absolute top-0 right-0 text-sm px-2 py-1 bg-white text-black rounded hover:opacity-80 transition"
              >
                설정
              </button>
            </>
          )}

          {isEditOpen && (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="mb-2 p-2 rounded border border-white bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="닉네임"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="mb-2 p-2 rounded border border-white bg-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="바이오"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={mutation.status === "pending"}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {mutation.status === "pending" ? "저장 중..." : "저장"}
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  취소
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <section className="w-full max-w-md mt-8 text-gray-900">
        <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
          최근 업로드한 LP
        </h2>

        {myLps.length === 0 ? (
          <p className="text-gray-500">업로드한 LP가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {myLps.map((lp) => (
              <li
                key={lp.id}
                className="cursor-pointer hover:underline"
                onClick={() => {
                  // 상세페이지 이동 (예: navigate(`/lp/${lp.id}`))
                }}
              >
                <h3 className="font-medium text-lg">{lp.title}</h3>
                <p className="text-sm text-gray-600 truncate">{lp.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        className="fixed bottom-40 right-12 bg-pink-500 hover:bg-pink-600 text-white text-3xl w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 z-50"
        onClick={() => setIsModalOpen(true)}
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
    </div>
  );
};

export default MyPage;
