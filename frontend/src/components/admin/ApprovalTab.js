import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Spinner } from "react-bootstrap";

const ApprovalTab = () => {
  const [attendApprovals, setAttendApprovals] = useState([]);
  const [leaveApprovals, setLeaveApprovals] = useState([]);
  const [expenseApprovals, setExpenseApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ 공통 fetch 함수
  const fetchData = async (url, setter, mapper) => {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setter(mapper(data));
    } catch (err) {
      console.error(`❌ ${url} 데이터 불러오기 실패:`, err);
      setter([]);
    }
  };

  // ✅ 출퇴근 / 연차 / 지출 불러오기
  const fetchAllApprovals = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchData("http://localhost:3000/attend", setAttendApprovals, (data) =>
          data.map((item) => ({
            id: item.attend_id,
            user_name: item.user_name,
            date: new Date(item.attend_date).toLocaleDateString("ko-KR"),
            type: item.status, // "출근" | "퇴근"
            status: item.approval_status,
          }))
        ),
        fetchData("http://localhost:3000/leave", setLeaveApprovals, (data) =>
          data.map((item) => ({
            id: item.leave_id,
            user_name: item.user_name,
            dept: item.dept_name,
            reason: item.reason,
            date: `${new Date(item.start_date).toLocaleDateString(
              "ko-KR"
            )} ~ ${new Date(item.end_date).toLocaleDateString("ko-KR")}`,
            type: "연차",
            status: item.approval_status,
          }))
        ),
        fetchData("http://localhost:3000/expense", setExpenseApprovals, (data) =>
          data.map((item) => ({
            id: item.expense_id,
            user_name: item.user_name,
            dept: item.dept_name,
            reason: item.purpose,
            amount: item.amount,
            date: new Date(item.applied_at).toLocaleDateString("ko-KR"),
            type: "지출",
            status: item.approval_status,
          }))
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApprovals();
  }, []);

  // ✅ 승인 / 거절 / 지각 공통 처리
  const handleApproval = async (category, id, action) => {
    const map = {
      approve: "승인",
      reject: "거절",
      late: "지각",
    };
    const approval_status = map[action];
    if (!approval_status) return;

    const endpointMap = {
      attend: `http://localhost:3000/admin/attend/approval/${id}`,
      leave: `http://localhost:3000/admin/leave/approval/${id}`,
      expense: `http://localhost:3000/admin/expense/approval/${id}`,
    };

    try {
      const res = await fetch(endpointMap[category], {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approval_status }),
      });

      if (res.ok) {
        alert(`✅ ${approval_status} 처리 완료`);

        // 승인된 항목 즉시 제거
        if (category === "attend") {
          setAttendApprovals((prev) => prev.filter((a) => a.id !== id));
        } else if (category === "leave") {
          setLeaveApprovals((prev) => prev.filter((a) => a.id !== id));
        } else if (category === "expense") {
          setExpenseApprovals((prev) => prev.filter((a) => a.id !== id));
        }
      }
    } catch (err) {
      console.error(`❌ ${category} 승인 오류:`, err);
    }
  };

  // ✅ 섹션 렌더링
  const renderSection = (title, items, category, showLate = false) => (
    <div className="mb-4">
      <h6 className="fw-bold mb-3">{title}</h6>
      {items.length === 0 ? (
        <p className="text-center text-muted small my-3">요청이 없습니다.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 shadow-sm bg-white"
              style={{ minHeight: "60px", lineHeight: "1.6" }}
            >
              <div className="d-flex flex-column flex-grow-1">
                <div className="fw-bold text-dark">{item.user_name}</div>
                <div className="text-muted small">
                  {item.date} |{" "}
                  <Badge
                    bg={
                      item.status === "승인"
                        ? "success"
                        : item.status === "지각"
                        ? "warning"
                        : item.status === "거절"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                {item.reason && (
                  <div className="small text-secondary">사유: {item.reason}</div>
                )}
                {item.amount && (
                  <div className="small text-secondary">
                    금액: {item.amount.toLocaleString()}원
                  </div>
                )}
              </div>

              <div className="d-flex gap-2 flex-shrink-0 ms-3">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleApproval(category, item.id, "approve")}
                >
                  승인
                </Button>
                {showLate && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleApproval(category, item.id, "late")}
                  >
                    지각
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleApproval(category, item.id, "reject")}
                >
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ 출근 / 퇴근 분리
  const attendStart = attendApprovals.filter((a) => a.type === "출근");
  const attendEnd = attendApprovals.filter((a) => a.type === "퇴근");

  return (
    <Card className="p-4 shadow-sm border-0 rounded-4">

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {renderSection("📥 출근 승인 요청", attendStart, "attend", true)}
          {renderSection("📤 퇴근 승인 요청", attendEnd, "attend")}
          {renderSection("🌴 연차 승인 요청", leaveApprovals, "leave")}
          {renderSection("💰 지출 승인 요청", expenseApprovals, "expense")}
        </>
      )}
    </Card>
  );
};

export default ApprovalTab;
