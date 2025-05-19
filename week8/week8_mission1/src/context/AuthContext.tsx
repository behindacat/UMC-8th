import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";
import { deleteAccount as deleteAccountApi } from "../apis/auth"; // 이름 변경 임포트

interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUserInfo: (info: UserInfo) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  login: async () => {},
  logout: async () => {},
  deleteAccount: async () => {},
  updateUserInfo: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          if (response?.data) {
            console.log("사용자 정보 로드:", response.data);
            setUserInfo(response.data);
          }
        } catch (error) {
          console.error("사용자 정보 로드 실패:", error);
        }
      }
    };

    loadUserInfo();
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        const userResponse = await getMyInfo();
        if (userResponse?.data) {
          setUserInfo(userResponse.data);
        }

        alert("로그인 성공");
        window.location.href = "/my";
      }
    } catch (error) {
      console.log("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.log("로그아웃 오류", error);
    } finally {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);

      alert("로그아웃 성공");
      window.location.href = "/my";
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccountApi();  // API 호출 (재귀 호출 아님)
      await logout();
      alert("회원 탈퇴 완료");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴 실패");
    }
  };

  const updateUserInfo = (info: UserInfo) => {
    console.log("사용자 정보 업데이트:", info);
    setUserInfo(info);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userInfo,
        login,
        logout,
        deleteAccount,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
