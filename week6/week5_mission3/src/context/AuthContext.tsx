import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

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
  updateUserInfo: (info: UserInfo) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  login: async () => {},
  logout: async () => {},
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

  // 초기 사용자 정보 로드
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

        // 로그인 후 사용자 정보 가져오기
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
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo(null);

      alert("로그아웃 성공");
      window.location.href = "/my";
    } catch (error) {
      console.log("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  const updateUserInfo = (info: UserInfo) => {
    console.log("사용자 정보 업데이트:", info);
    // 강제로 상태 업데이트
    setUserInfo(info);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, userInfo, login, logout, updateUserInfo }}>
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