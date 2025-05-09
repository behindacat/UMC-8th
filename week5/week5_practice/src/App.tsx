// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute";

const role = "ADMIN"; // 가상의 사용자 역할 ADMIN -> USER로 바꾸면 접근이 거부됨.

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 보호된 라우트: ADMIN만 접근 가능 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </Router>
  );
}
