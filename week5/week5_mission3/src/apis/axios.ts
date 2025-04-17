import axios, { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { error } from "console";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
   _retry?:boolean; //요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복요청을 방지한다.
let refreshPromise:Promise<string>|null = null;

export const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_SERVER_API_URL,
   withCredentials: true,
});


// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다.
axiosInstance.interceptors.request.use(
   (config) => {
      const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
      const accessToken = getItem();

      // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가한다.
      if (accessToken) {
         config.headers = config.headers || {};
         config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // 수정된 요청 설정을 반환합니다.
      return config;
   },
   // 요청 인터셉터가 실패하면, 에러 뿜음.
   (error) => Promise.reject(error),

);

axiosInstance.interceptors.response.use(
   (response) => response,
   async(error) => {
      const originalRequest: CustomInternalAxiosRequestConfig = error.config;

      if (
         error.response &&
         error.response.status === 401 &&
         !originalRequest._retry
      ){
         if (originalRequest.url === "/v1/auth/refresh"){
            const {removeItem:removeAcessToken} = useLocalStorage(
               LOCAL_STORAGE_KEY.accessToken,
            );
            const {removeItem:removeRefreshToken} = useLocalStorage(
               LOCAL_STORAGE_KEY.refreshToken,
            );
            removeAcessToken();
            removeRefreshToken();
            window.location.href="/login";
            return Promise.reject(error);
         }

         originalRequest._retry = true;

         if (!refreshPromise) {
            refreshPromise = (async () => {
               const { getItem:getRefreshToken } = useLocalStorage(
                  LOCAL_STORAGE_KEY.refreshToken,
               );
               const refreshToken = getRefreshToken();

               const { data } = await axiosInstance.post("/v1/auth/refresh", {
                  refresh:refreshToken,
               });
               const { setItem:setAccessToken } =useLocalStorage(
                  LOCAL_STORAGE_KEY.accessToken,
               );
               const { setItem:setRefreshToken } =useLocalStorage(
                  LOCAL_STORAGE_KEY.refreshToken,
               );
               setAccessToken(data.data.accessToken);
               setRefreshToken(data.data.refreshToken);

               return data.data.accessToken;
            })()
            .catch((error) => {
               const { removeItem:removeAcessToken} =useLocalStorage(
                  LOCAL_STORAGE_KEY.accessToken,
               );
               const { removeItem:removeRefreshToken} =useLocalStorage(
                  LOCAL_STORAGE_KEY.refreshToken,
               );
               removeAcessToken();
               removeRefreshToken();
            })
            .finally(() => {
               refreshPromise = null;
            });
         }
         return refreshPromise.then((newAccessToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            return axiosInstance.request(originalRequest);
         });
      }

      return Promise.reject(error);
   },
);