import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const ExpenseDetailPage = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/expenses/${id}`);
        setExpense(res.data);
      } catch (err) {
        console.error("지출 상세 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>불러오는 중...</p>
      </div>
    );

  if (!expense) return <p className="text-center mt-5">데이터를 찾을 수 없습니다.</p>;

  return (
    <div className="p-4">
      <Card className="p-3 shadow">
        <h4 className="fw-bold mb-3">지출 상세 내역</h4>
        <p>
          <strong>제목:</strong> {expense.title}
        </p>
        <p>
          <strong>금액:</strong> {expense.amount.toLocaleString()}원
        </p>
        <p>
          <strong>날짜:</strong> {expense.date}
        </p>
        <p>
          <strong>내용:</strong> {expense.description}
        </p>
      </Card>
    </div>
  );
};

export default ExpenseDetailPage;
