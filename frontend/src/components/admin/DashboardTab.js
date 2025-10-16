import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, ProgressBar } from "react-bootstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const DashboardTab = ({ setActiveTab }) => {
  const [attendanceRateData, setAttendanceRateData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ 최근 7일 날짜 구하기
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  // ✅ 출근율 데이터 GET 요청
  const fetchAttendanceRates = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    try {
      const last7Days = getLast7Days();
      const results = [];

      for (const date of last7Days) {
        const res = await axios.get(
          `http://localhost:3000/attend/status?date=${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const employees = res.data?.employees || [];
        const total = employees.length;
        const present = employees.filter((e) => e.status !== "미출근").length;
        const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        results.push({ name: date.slice(5), value: Number(rate) });
      }

      setAttendanceRateData(results);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  // ✅ 연차 데이터 GET 요청
  const fetchLeaveData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const leaves = res.data || [];
      const approved = leaves.filter((l) => l.approval_status === "승인");

      const monthCount = Array(12).fill(0);
      approved.forEach((leave) => {
        const start = new Date(leave.start_date);
        const month = start.getMonth();
        monthCount[month] += 1;
      });

      const formatted = monthCount.map((count, i) => ({
        name: `${i + 1}월`,
        value: count,
      }));

      setLeaveData(formatted);
    } catch (err) {
      console.error("연차 데이터 로드 실패:", err);
    }
  };

  // ✅ 지출 데이터 GET 요청 (승인된 항목만, created_at 기준)
  const fetchExpenseData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const expenses = (res.data || []).filter(
        (e) => e.approval_status === "승인"
      );

      const monthTotal = Array(12).fill(0);
      expenses.forEach((exp) => {
        const date = new Date(exp.created_at);
        const month = date.getMonth();
        monthTotal[month] += Number(exp.amount || 0);
      });

      const formatted = monthTotal.map((sum, i) => ({
        name: `${i + 1}월`,
        value: sum,
      }));

      setExpenseData(formatted);
    } catch (err) {
      console.error("지출 데이터 로드 실패:", err);
    }
  };

  // ✅ 전체 데이터 불러오기
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchAttendanceRates(),
      fetchLeaveData(),
      fetchExpenseData(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const averageRate =
    attendanceRateData.length > 0
      ? (
          attendanceRateData.reduce((sum, d) => sum + d.value, 0) /
          attendanceRateData.length
        ).toFixed(1)
      : 0;

  return (
    <>
      {/* 📊 출근율 */}
      <Card className="p-4 shadow-sm mb-3 rounded-4 mx-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">📈 최근 7일 출근율 추세</h6>
          {!loading && (
            <span className="text-primary fw-semibold">
              평균 출근율: {averageRate}%
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">출근율 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#007bff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4">
              {attendanceRateData.map((item) => (
                <div
                  key={item.name}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div className="text-muted small" style={{ width: 50 }}>
                    {item.name}
                  </div>
                  <div className="flex-grow-1 mx-2">
                    <ProgressBar
                      now={item.value}
                      label={`${item.value}%`}
                      style={{ height: "16px" }}
                      variant={item.value >= 80 ? "success" : "warning"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* 🏖️ 연차 사용도 */}
      <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
        <h6 className="fw-bold mb-3">🏖️ 연차 사용도</h6>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-muted">연차 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* 💰 지출도 (막대그래프 + 금액 표시) */}
      <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
        <h6 className="fw-bold mb-3">💰 지출도</h6>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted">지출 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${v.toLocaleString()}원`} />
              <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
              <Bar dataKey="value" fill="#ffc107" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) =>
                    v > 0 ? `${v.toLocaleString()}원` : ""
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="text-center my-4">
        <Button variant="primary" onClick={() => setActiveTab("employee")}>
          👥 관리자 페이지로 이동
        </Button>
      </div>
    </>
  );
};

export default DashboardTab;
