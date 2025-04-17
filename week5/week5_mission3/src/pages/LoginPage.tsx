import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { UserSignInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import React from "react";

const LoginPage = () => {
   const { login, accessToken } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (accessToken) {
         navigate('/');
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
      await login(values);
   };

   const handleGoogleLogin = () => {
      window.location.href =
         import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
   };

   const isDisabled =
      Object.values(errors || {}).some((error) => error.length >0) ||
      Object.values(values).some((value) => value === "");
   
   return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white relative">
         <div className="w-[300px] mb-6">
            <div className="relative w-full mb-6 flex justify-center items-center">
               <button
                  onClick={() => navigate(-1)}
                  className="absolute left-5 text-white text-2xl"
               >
                  &lt;
               </button>
               <h2 className="text-2xl font-semibold text-center">로그인</h2>
            </div>
         </div>

         <div className="flex flex-col gap-3">
            <input
               {...getInputProps("email")}
               name="email"
               className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
               ${errors?.email && touched.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
               type={"email"}
               placeholder={"이메일"}
            />
            {errors?.email && touched?.email && (
               <div className='text-red-500 text-sm'>{errors.email}</div>
            )}
            
            <input
               {...getInputProps("password")}
               className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
               ${errors?.password && touched.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
               type={"password"}
               placeholder={"비밀번호"}
            />
            {errors?.password && touched?.password && (
               <div className='text-red-500 text-sm'>{errors.password}</div>
            )}
            <button
               type='button'
               onClick={handleSubmit}
               disabled={isDisabled}
               className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
            >
               로그인
            </button>
            <button 
               type='button'
               onClick={handleGoogleLogin}
               className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
            >
               <div className="flex item-center justify-center gap-4">
                  <img src={"/images/Google.png"} alt="Google Logo Image" className="w-6 h-6"/>
                  <span>구글 로그인</span>
               </div>
            </button>
         </div>
      </div>
   )
};

export default LoginPage;