import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AttendancePage from "./pages/AttendancePage";
import VacationPage from "./pages/VacationPage";
import ExpensePage from "./pages/ExpensePage";
import ExpenseListPage from "./pages/ExpenseListPage";
import AdminDashboard from "./pages/AdminDashboard";
import Nav from "./components/Nav";
import HomePage from "./pages/Home";
import Login from "./pages/Login";


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
        navigate("/home"); // ✅ 기본 홈으로 이동하도록 변경
    }
  };

  // ✅ 로그인 / 회원가입 화면에서는 Nav 숨기기
  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        {/* ✅ '/' 접속 시 로그인 페이지로 이동 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ✅ 로그인 / 회원가입 */}
        <Route path="/login" element={<Login />} />
      

        {/* ✅ 로그인 성공 후 홈 */}
        <Route path="/home" element={<HomePage />} />

        {/* ✅ 일반 페이지 */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/vacation" element={<VacationPage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/expense-list" element={<ExpenseListPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ✅ 존재하지 않는 경로 → 로그인으로 이동 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* ✅ Nav는 로그인/회원가입 화면이 아닐 때만 표시 */}
      {!hideNav && <Nav onMenuSelect={handleMenuSelect} />}
    </>
  );
}

export default App;
