import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Badge } from "react-bootstrap";
import Header from "../components/Header";

const ExpenseListPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const url = "http://localhost:3000/expense"; // ✅ 백엔드 주소

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ [FETCH SUCCESS]", response.data);
        setExpenses(response.data);
      } catch (err) {
        console.error("❌ [FETCH ERROR]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>지출 내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container py-4">
        {/* 상단 헤더 */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">💰 내 지출 내역</h4>
          <Badge bg="secondary" className="fs-6 px-3 py-2">
            총 {expenses.length}건
          </Badge>
        </div>

        {/* 본문 리스트 */}
        {expenses.length === 0 ? (
          <Card className="p-4 text-center shadow-sm border-0">
            <p className="text-muted mb-0">등록된 지출 내역이 없습니다.</p>
          </Card>
        ) : (
          <div className="d-flex flex-column gap-3">
            {expenses.map((exp) => (
              <Card
                key={exp.expense_id}
                className="shadow-sm border-0 rounded-4 p-3"
                style={{
                  transition: "0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 6px rgba(0,0,0,0.1)")
                }
              >
                <div className="d-flex justify-content-between align-items-center">
                  {/* 왼쪽: 내용 + 날짜 */}
                  <div>
                    <div className="fw-semibold fs-5 mb-1">
                      {exp.category || "기타"}
                    </div>
                    <div className="text-muted small mb-1">
                      {exp.description || "내용 없음"}
                    </div>
                    <div className="text-muted small">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* 오른쪽: 금액 + 상태 */}
                  <div className="text-end">
                    <div className="text-primary fw-bold fs-5">
                      {Number(exp.amount).toLocaleString()}원
                    </div>
                    <Badge
                      bg={
                        exp.approval_status === "승인"
                          ? "success"
                          : exp.approval_status === "반려" ||
                            exp.approval_status === "거절"
                          ? "danger"
                          : "secondary"
                      }
                      className="mt-2"
                    >
                      {exp.approval_status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseListPage;
