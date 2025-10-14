// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AttendancePage from "./pages/AttendancePage";
import VacationPage from "./pages/VacationPage";
import ExpensePage from "./pages/ExpensePage";
import ExpenseListPage from "./pages/ExpenseListPage";
import AdminPage from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Nav from "./components/Nav";
import HomePage from "./pages/Home";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

// ✅ 공통 레이아웃 (모든 페이지에 BottomNav 유지)
function MainLayout() {
  const navigate = useNavigate();

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

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/vacation" element={<VacationPage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/expense-list" element={<ExpenseListPage />} />
        <Route path="/admin" element={<AdminPage />} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* ✅ 하단 네비 항상 표시 */}
     <Nav onMenuSelect={handleMenuSelect} />
    </>
  );
}

export default App;
