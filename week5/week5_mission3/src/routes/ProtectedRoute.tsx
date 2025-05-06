import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    // 이미 로그인되어 있으면 팝업을 띄우지 않음
    if (accessToken) return;

    // alertShown이 false일 때만 confirm 팝업을 띄움
    if (!alertShown) {
      const shouldRedirect = window.confirm("로그인이 필요한 기능입니다. 로그인하시겠습니까?");
      setAlertShown(true);

      // 사용자가 확인을 눌렀을 경우에만 로그인 페이지로 리디렉션
      if (shouldRedirect) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }, [accessToken, alertShown, navigate, location]);

  // 로그인되지 않으면 자식 컴포넌트를 렌더링하지 않음
  if (!accessToken) {
    return null; // 팝업 이후 로그인 페이지로 전환되기 전까지는 아무것도 보여주지 않음
  }

  return <>{children}</>;
};

export default ProtectedRoute;
