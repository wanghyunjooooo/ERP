import React, { useState, useEffect } from "react";
import { Card, Button, ProgressBar, ListGroup, Container } from "react-bootstrap";
import BottomNav from "../components/Nav";
import Header from "../components/Header"; 
function AttendancePage() {
  const [isWorking, setIsWorking] = useState(false);
  const [totalHours, setTotalHours] = useState(36); // 예시: 주간 총 근무시간
  const [goalHours] = useState(40); // 목표 근무시간

  const [approvals, setApprovals] = useState([
    { id: 1, title: "연차 신청 승인", date: "2025-10-10", status: "승인" },
    { id: 2, title: "지출 내역 승인", date: "2025-10-12", status: "반려" },
  ]);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
    setCurrentDate(formatted);
  }, []);

  const handleWorkToggle = () => {
    setIsWorking(!isWorking);
    // 🔹 TODO: 출근/퇴근 API 연동
  };

  const handleMenuSelect = (menu) => {
    console.log("메뉴 선택:", menu);
  };

  return (
     <>
      <Header />

    <Container
      fluid
      className="d-flex flex-column align-items-center px-3"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f7fe, #e5ecfb)",
        paddingBottom: "100px", // ✅ 하단 네비 공간 확보
      }}
    >
      {/* 현재 날짜 */}
      <h5 className="fw-semibold mt-4 text-secondary">{currentDate}</h5>

      {/* 출근/퇴근 버튼 */}
      <Card
        className="shadow-sm border-0 mt-3 text-center"
        style={{
          borderRadius: "18px",
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "white",
        }}
      >
        <Card.Body>
          <h5 className="fw-bold mb-3">근무 상태</h5>
          <Button
            onClick={handleWorkToggle}
            className="fw-semibold px-4 py-2 rounded-4"
            style={{
              backgroundColor: isWorking ? "#dc3545" : "#4e73df",
              border: "none",
              fontSize: "1.05rem",
            }}
          >
            {isWorking ? "퇴근하기" : "출근하기"}
          </Button>
        </Card.Body>
      </Card>

      {/* 주간 근무시간 */}
      <Card
        className="shadow-sm border-0 mt-4 p-3 text-center"
        style={{
          borderRadius: "18px",
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "white",
        }}
      >
        <h6 className="fw-bold mb-2 text-secondary">주간 근무시간</h6>
        <ProgressBar
          now={(totalHours / goalHours) * 100}
          label={`${totalHours}h / ${goalHours}h`}
          variant="info"
          style={{
            height: "18px",
            borderRadius: "10px",
            backgroundColor: "#e9ecef",
          }}
        />
      </Card>

      {/* 승인 내역 */}
      <Card
        className="shadow-sm border-0 mt-4 mb-5"
        style={{
          borderRadius: "18px",
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "white",
        }}
      >
        <Card.Body>
          <h6 className="fw-bold mb-3 text-secondary">승인 내역</h6>
          <ListGroup variant="flush">
            {approvals.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-semibold">{item.title}</div>
                  <small className="text-muted">{item.date}</small>
                </div>
                <span
                  className={`fw-bold ${
                    item.status === "승인"
                      ? "text-success"
                      : item.status === "반려"
                      ? "text-danger"
                      : "text-secondary"
                  }`}
                >
                  {item.status}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* 하단 네비게이션 */}
      <BottomNav onMenuSelect={handleMenuSelect} />
    </Container>
     </>
  );
}

export default AttendancePage;
