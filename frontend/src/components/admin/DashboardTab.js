import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardTab = ({ setActiveTab }) => {
  const activityData = [
    { name: "월", value: 40 },
    { name: "화", value: 80 },
    { name: "수", value: 65 },
    { name: "목", value: 90 },
    { name: "금", value: 75 },
  ];
  const leaveData = [
    { name: "1월", value: 3 },
    { name: "2월", value: 5 },
    { name: "3월", value: 2 },
  ];
  const expenseData = [
    { name: "1월", value: 200 },
    { name: "2월", value: 150 },
    { name: "3월", value: 300 },
  ];

  return (
    <>
      <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
        <h6 className="fw-bold mb-3">📈 활동도</h6>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
        <h6 className="fw-bold mb-3">🏖️ 연차 사용도</h6>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={leaveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#28a745" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
        <h6 className="fw-bold mb-3">💰 지출도</h6>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={expenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ffc107" />
          </LineChart>
        </ResponsiveContainer>
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
