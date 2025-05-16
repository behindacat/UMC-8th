import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { UserSignInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import React from "react";
import Navbar from "../components/Navbar";

const LoginPage = () => {
   const { login, accessToken } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (accessToken) {
         navigate('/my');
      }
   }, [navigate, accessToken]);
   

   const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
      initialValue: {
         email: "",
         password: "",
      },
      validate: validateSignin,
   });

   const handleSubmit = async () => {
      try {
         await login(values);      // 로그인 시도
         navigate("/my");          // 로그인 성공 시 마이페이지로 이동
      } catch (err) {
         alert("❌ 로그인 실패");   // 실패 시 알림
      }
   };
   
    

   const handleGoogleLogin = () => {
      window.location.href =
         import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
   };

   const isDisabled =
      Object.values(errors || {}).some((error) => error.length >0) ||
      Object.values(values).some((value) => value === "");
   
   return (
      <div className="min-h-screen bg-black text-white pt-24">
         <Navbar />

         <div className="flex justify-center items-center mt-12">
            <div className="flex flex-col gap-4 w-[320px]">
               <input
               {...getInputProps("email")}
               name="email"
               className={`border p-[10px] focus:border-[#807bff] rounded-sm
                  ${errors?.email && touched.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
               type="email"
               placeholder="이메일"
               />
               {errors?.email && touched?.email && (
               <div className="text-red-500 text-sm">{errors.email}</div>
               )}

               <input
               {...getInputProps("password")}
               className={`border p-[10px] focus:border-[#807bff] rounded-sm
                  ${errors?.password && touched.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
               type="password"
               placeholder="비밀번호"
               />
               {errors?.password && touched?.password && (
               <div className="text-red-500 text-sm">{errors.password}</div>
               )}

               <button
               type="button"
               onClick={handleSubmit}
               disabled={isDisabled}
               className="bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
               >
               로그인
               </button>

               <button
               type="button"
               onClick={handleGoogleLogin}
               className="bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
               >
               <div className="flex items-center justify-center gap-4">
                  <img src={"/images/Google.png"} alt="Google Logo" className="w-6 h-6" />
                  <span>구글 로그인</span>
               </div>
               </button>
            </div>
         </div>
      </div>

   )
};

export default LoginPage;