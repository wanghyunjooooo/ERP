import React, { useState, useEffect } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import Header from "../components/Header";
import DashboardTab from "../components/admin/DashboardTab";
import EmployeeTab from "../components/admin/EmployeeTab";
import ApprovalTab from "../components/admin/ApprovalTab";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <>
      <Header />
      <div style={{ height: "20px" }}></div>

      <Container
        fluid
        className="py-3"
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          maxWidth: "430px",
          overflowY: "auto",
          paddingBottom: "150px",
        }}
      >
        <div className="text-center mb-3">
          <h5 className="fw-bold text-primary">관리자 페이지</h5>
          <p className="text-muted small">ERP 시스템 관리 패널</p>
        </div>

        {/* 상단 탭 */}
        <Nav
          variant="tabs"
          className="justify-content-around mb-3 bg-white shadow-sm rounded-3 px-1"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          <Nav.Item>
            <Nav.Link eventKey="dashboard">📊 대시보드</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="employee">👥 직원 관리</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="approval">✅ 승인 관리</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "dashboard" && <DashboardTab setActiveTab={setActiveTab} />}
        {activeTab === "employee" && <EmployeeTab />}
        {activeTab === "approval" && <ApprovalTab />}
      </Container>
    </>
  );
}

export default AdminDashboard;
