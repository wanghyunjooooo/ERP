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
import ExpenseDetailPage from "./pages/ExpenseDetailPage";
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
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/home");
    }
  };

  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/vacation" element={<VacationPage />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/expense-list" element={<ExpenseListPage />} />
        <Route path="/expense/:id" element={<ExpenseDetailPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!hideNav && <Nav onMenuSelect={handleMenuSelect} />}
    </>
  );
}

export default App;
