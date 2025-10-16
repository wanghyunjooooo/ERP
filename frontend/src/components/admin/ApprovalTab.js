import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Spinner } from "react-bootstrap";

const ApprovalTab = () => {
  const [attendApprovals, setAttendApprovals] = useState([]);
  const [leaveApprovals, setLeaveApprovals] = useState([]);
  const [expenseApprovals, setExpenseApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async (url, setter, mapper) => {
    try {
      console.log(`📡 요청: ${url}`);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`📡 응답 상태: ${res.status}`);
      const data = await res.json();
      console.log(`📦 ${url} 응답 데이터:`, data);

      const filtered = data.filter((item) => item.approval_status === "대기");
      console.log(`🧩 ${url} 대기 데이터 (${filtered.length}개):`, filtered);

      setter(mapper(filtered));
    } catch (err) {
      console.error(`❌ ${url} 데이터 불러오기 실패:`, err);
      setter([]);
    }
  };

  const fetchAllApprovals = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchData("http://localhost:3000/attend", setAttendApprovals, (data) =>
          data.map((item) => {
            let type = "기타";
            if (item.status.includes("출근")) type = "출근";
            else if (item.status.includes("퇴근")) type = "퇴근";
            return {
              id: item.attend_id,
              user_name: item.user_name,
              date: new Date(item.attend_date).toLocaleDateString("ko-KR"),
              type,
              status: item.approval_status,
            };
          })
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
            reason: item.description,
            amount: parseFloat(item.amount),
            date: new Date(item.created_at).toLocaleDateString("ko-KR"),
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

  const handleApproval = async (category, id, action) => {
    const map = { approve: "승인", reject: "거절", late: "지각" };
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
        await fetchAllApprovals();
      } else {
        console.error("❌ 승인 실패:", res.statusText);
      }
    } catch (err) {
      console.error(`❌ ${category} 승인 오류:`, err);
    }
  };

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
