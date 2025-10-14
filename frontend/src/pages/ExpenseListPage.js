// src/pages/ExpenseListPage.js
import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { BsBarChart, BsArrowUpCircle, BsArrowDownCircle } from "react-icons/bs";
import BottomNav from "../components/Nav";
import Header from "../components/Header";

function ExpenseListPage({ onMenuSelect }) {
  const expenses = [
    { id: 1, date: "2025-10-01", amount: 25000, reason: "교통비", status: "승인" },
    { id: 2, date: "2025-10-04", amount: 48000, reason: "식비", status: "대기" },
    { id: 3, date: "2025-10-07", amount: 120000, reason: "회식비", status: "거절" },
  ];

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const max = Math.max(...expenses.map((e) => e.amount));
  const min = Math.min(...expenses.map((e) => e.amount));

  return (

       <>
      <Header />
    
    <div
      className="d-flex flex-column align-items-center justify-content-start"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingBottom: "100px",
        paddingTop: "20px",
      }}
    >
      <Card
        className="shadow-sm border-0"
        style={{
          width: "92%",
          borderRadius: "20px",
          background: "#ffffff",
        }}
      >
        <Card.Body>
          <h5 className="fw-bold mb-3 d-flex align-items-center">
            <BsBarChart className="me-2 text-primary" /> 지출 조회
          </h5>

          {/* ✅ 통계 */}
          <div className="mb-3 text-center">
            <div className="fw-semibold">총 지출: {total.toLocaleString()}원</div>
            <div className="text-muted small mt-1">
              최고: <BsArrowUpCircle className="text-danger" />{" "}
              {max.toLocaleString()}원 / 최저:{" "}
              <BsArrowDownCircle className="text-success" />{" "}
              {min.toLocaleString()}원
            </div>
          </div>

          {/* ✅ 상태바 */}
          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>예산 대비 사용률</span>
              <span className="text-primary">60%</span>
            </div>
            <ProgressBar
              now={60}
              variant="primary"
              style={{ height: "8px", borderRadius: "5px" }}
            />
          </div>

          {/* ✅ 목록 */}
          {expenses.map((e) => (
            <Card
              key={e.id}
              className="border-0 shadow-sm mb-2 p-3"
              style={{
                borderLeft:
                  e.status === "승인"
                    ? "4px solid #4e73df"
                    : e.status === "거절"
                    ? "4px solid #e74a3b"
                    : "4px solid #f6c23e",
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <div className="fw-bold">{e.reason}</div>
                  <div className="small text-muted">{e.date}</div>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">
                    {e.amount.toLocaleString()}원
                  </div>
                  <div
                    className="small"
                    style={{
                      color:
                        e.status === "승인"
                          ? "#4e73df"
                          : e.status === "거절"
                          ? "#e74a3b"
                          : "#f6c23e",
                      fontWeight: "600",
                    }}
                  >
                    {e.status}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </Card.Body>
      </Card>

      <BottomNav onMenuSelect={onMenuSelect} />
    </div>
      </>
  );
}

export default ExpenseListPage;
