import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App 컴포넌트 임포트
import "./styles.css"; // 여기서 스타일을 임포트

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
