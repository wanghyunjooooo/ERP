import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, ProgressBar, Navbar, Nav } from "react-bootstrap";
import BottomNav from "../components/Nav";

function Home() {
  const [isWorking, setIsWorking] = useState(false);
  const [today, setToday] = useState("");
  const [totalHours, setTotalHours] = useState(120);
  const maxHours = 160;

    const handleMenuSelect = (menu) => {
    console.log("선택된 메뉴:", menu);
    // 나중에 여기에 라우팅 (페이지 이동) 넣을 수 있음
  };


  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    setToday(formatted);
  }, []);

  const handleWorkToggle = () => {
    setIsWorking(!isWorking);
  };

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* 상단 네비게이션 */}
      <Navbar
        fixed="top"
        style={{
          background: "linear-gradient(135deg, #74ABE2, #5563DE)",
          color: "white",
        }}
        className="shadow-sm"
      >
        <Container className="justify-content-center">
          <Navbar.Brand className="text-white fw-bold fs-5 mb-0">
            ERP
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* 메인 콘텐츠 */}
      <Container className="pt-5 mt-4">
        <h5 className="fw-bold mt-3 mb-2 text-center">안녕하세요 👋</h5>
        <p className="text-muted text-center mb-4">{today}</p>

        {/* 출근/퇴근 카드 */}
        <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">출근 / 퇴근</Card.Title>
          <div className="text-center">
            <Button
              variant={isWorking ? "danger" : "success"}
              className="rounded-3 px-4 py-2 fw-semibold"
              onClick={handleWorkToggle}
            >
              {isWorking ? "퇴근하기" : "출근하기"}
            </Button>
            <p className="mt-3 text-muted mb-0">
              현재 상태:{" "}
              <strong style={{ color: isWorking ? "red" : "green" }}>
                {isWorking ? "근무 중" : "퇴근 상태"}
              </strong>
            </p>
          </div>
        </Card>

        {/* 근무 시간 현황 */}
        <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">근무 시간 현황</Card.Title>
          <Row>
            <Col xs={12} className="mb-3">
              <p className="mb-1 text-muted small">이번달 총 근무시간</p>
              <ProgressBar
                now={(totalHours / maxHours) * 100}
                label={`${totalHours}h / ${maxHours}h`}
                style={{ height: "22px", borderRadius: "10px" }}
              />
            </Col>
            <Col xs={12}>
              <p className="mb-1 text-muted small">이번주 근무시간</p>
              <ProgressBar
                now={70}
                label="35h / 40h"
                variant="info"
                style={{ height: "22px", borderRadius: "10px" }}
              />
            </Col>
          </Row>
        </Card>

        {/* 승인 내역 카드형 리스트 */}
        <Card className="shadow-sm p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">승인 내역</Card.Title>

          <div className="d-flex flex-column gap-3">
            <Card className="p-3 border-0 shadow-sm rounded-3">
              <p className="fw-semibold mb-1">연차 신청</p>
              <p className="text-muted small mb-1">2025-10-10</p>
              <span className="badge bg-success">승인됨</span>
              <p className="small mt-2 mb-0 text-secondary">정상 승인 처리</p>
            </Card>

            <Card className="p-3 border-0 shadow-sm rounded-3">
              <p className="fw-semibold mb-1">지출 신청</p>
              <p className="text-muted small mb-1">2025-10-12</p>
              <span className="badge bg-warning text-dark">대기 중</span>
              <p className="small mt-2 mb-0 text-secondary">관리자 검토 중</p>
            </Card>
          </div>
        </Card>
      </Container>

      {/* 하단 탭바 */}
        <BottomNav onMenuSelect={handleMenuSelect} />
    </div>
  );
}

export default Home;
