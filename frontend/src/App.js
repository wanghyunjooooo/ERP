import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, // ✅ 추가
  useNavigate,
  useLocation,
} from "react-router-dom";
import AttendancePage from "./pages/AttendancePage";
import VacationPage from "./pages/VacationPage";
import ExpensePage from "./pages/ExpensePage";
import ExpenseListPage from "./pages/ExpenseListPage";
import AdminPage from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Nav from "./components/Nav";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuSelect = (menu) => {
    switch (menu) {
      case "attendance":
        navigate("/attendance");
        break;
      case "vacation":
        navigate("/vacation");
        break;
      case "expense":
        navigate("/expense");
        break;
      case "expenseList":
        navigate("/expense-list");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  // ✅ 로그인 / 회원가입 화면에서는 Nav 숨기기
  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        {/* ✅ 기본 경로('/')로 접속하면 자동으로 /login으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 로그인 / 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 일반 페이지 */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/vacation" element={<VacationPage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/expense-list" element={<ExpenseListPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 혹시 존재하지 않는 경로 → 로그인으로 이동 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* ✅ Nav는 로그인/회원가입 화면이 아닐 때만 표시 */}
      {!hideNav && <Nav onMenuSelect={handleMenuSelect} />}
    </>
  );
}

export default App;
