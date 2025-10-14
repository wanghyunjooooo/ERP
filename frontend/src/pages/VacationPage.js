import React, { useState } from "react";
import { Card, Form, Button, Row, Col, ProgressBar } from "react-bootstrap";
import BottomNav from "../components/Nav";
import { BsCalendar4Week, BsClipboardCheck } from "react-icons/bs";
import Header from "../components/Header";

function VacationPage({ onMenuSelect }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [usedDays, setUsedDays] = useState(7); // 예시: 사용한 연차
  const [totalDays, setTotalDays] = useState(15); // 총 연차

  const handleApply = () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택해주세요!");
      return;
    }
    alert(`연차 신청 완료!\n기간: ${startDate} ~ ${endDate}\n사유: ${reason}`);
  };

  // ✅ 연차 계산 (간단히 날짜 차이 계산)
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const requestedDays = calculateDays();
  const remainingDays = totalDays - usedDays - requestedDays;

  return (

     <>
      <Header/>

    <div
      className="d-flex flex-column align-items-center justify-content-start"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingBottom: "100px", // nav 공간 확보
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
            <BsCalendar4Week className="me-2 text-primary" /> 연차 신청
          </h5>

          {/* 날짜 선택 */}
          <Row className="mb-3">
            <Col>
              <Form.Label>시작일</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Label>종료일</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>
          </Row>

          {/* 사유 입력 */}
          <Form.Group className="mb-3">
            <Form.Label>사유</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="연차 사용 사유를 입력하세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>

          {/* 계산 결과 */}
          <Card className="border-0 shadow-sm p-3 mb-3">
            <div className="d-flex justify-content-between">
              <span>신청 일수</span>
              <strong className="text-primary">{requestedDays}일</strong>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span>남은 연차</span>
              <strong className="text-success">{remainingDays}일</strong>
            </div>
            <ProgressBar
              now={(usedDays / totalDays) * 100}
              className="mt-3"
              variant="info"
            />
            <small className="text-muted">
              사용 {usedDays}일 / 총 {totalDays}일
            </small>
          </Card>

          <Button
            onClick={handleApply}
            className="w-100 rounded-pill py-2 fw-bold"
            variant="primary"
          >
            <BsClipboardCheck className="me-2" />
            연차 신청하기
          </Button>
        </Card.Body>
      </Card>

      {/* ✅ 하단 네비게이션 */}
      <BottomNav onMenuSelect={onMenuSelect} />
    </div>
     </>
  );
}

export default VacationPage;
