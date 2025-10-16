import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Spinner } from "react-bootstrap";

const ApprovalTab = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/attend", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const formatted = data.map((item) => ({
        id: item.attend_id,
        user_name: item.user_name,
        date: new Date(item.attend_date).toLocaleDateString("ko-KR"),
        type: item.status, // "출근" 또는 "퇴근"
        status: item.approval_status,
      }));

      setApprovals(formatted);
    } catch (err) {
      console.error("❌ 승인 목록 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAttendApproval = async (id, status) => {
    const map = { approve: "승인", late: "지각", reject: "거절" };
    const approval_status = map[status];
    if (!approval_status) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/admin/attend/approval/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approval_status }),
        }
      );

      if (res.ok) {
        alert(`'${approval_status}' 처리 완료`);
        fetchApprovals();
      }
    } catch (err) {
      console.error("❌ 승인 처리 오류:", err);
    }
  };

  const renderSection = (title, type) => {
    const filtered = approvals.filter((a) => a.type === type);

    return (
      <div className="mb-4">
        <h6 className="fw-bold mb-3">
          {type === "출근" ? "📥 출근 승인 요청" : "📤 퇴근 승인 요청"}
        </h6>

        {filtered.length === 0 ? (
          <p className="text-center text-muted small my-3">
            해당 요청이 없습니다.
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 shadow-sm bg-white"
                style={{
                  minHeight: "60px",
                  lineHeight: "1.6",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {/* 왼쪽 정보 */}
                <div className="d-flex flex-column flex-grow-1">
                  <div className="fw-bold text-dark mb-1">
                    {item.user_name}
                  </div>
                  <div className="text-muted small">
                    {item.date} | 상태:{" "}
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

                {/* 오른쪽 버튼 */}
                <div className="d-flex gap-2 flex-shrink-0 ms-3">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleAttendApproval(item.id, "approve")}
                  >
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleAttendApproval(item.id, "late")}
                  >
                    지각
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAttendApproval(item.id, "reject")}
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
  };

  return (
    <Card className="p-4 shadow-sm border-0 rounded-4">
      <h5 className="fw-bold mb-4 text-center">✅ 출퇴근 승인 관리</h5>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {renderSection("출근", "출근")}
          {renderSection("퇴근", "퇴근")}
        </>
      )}
    </Card>
  );
};

export default ApprovalTab;
