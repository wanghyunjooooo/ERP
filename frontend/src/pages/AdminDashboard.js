import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import {
  BsBarChart,
  BsPeopleFill,
  BsUmbrellaFill,
  BsCashStack,
} from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const activityData = [
  { day: "월", 활동도: 40, 연차: 10, 지출: 20 },
  { day: "화", 활동도: 60, 연차: 15, 지출: 25 },
  { day: "수", 활동도: 55, 연차: 10, 지출: 30 },
  { day: "목", 활동도: 70, 연차: 20, 지출: 35 },
  { day: "금", 활동도: 80, 연차: 5, 지출: 40 },
];

function AdminDashboard() {
  return (
    <Container
      fluid
      className="py-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "env(safe-area-inset-bottom)",
        maxWidth: "430px",
      }}
    >
      <div className="text-center mb-4">
        <h4 className="fw-bold text-primary mb-1">관리자 대시보드</h4>
        <p className="text-muted small">ERP 시스템 활동 요약</p>
      </div>

      {/* 상단 요약 카드 */}
      <Row className="g-3 px-2">
        <Col xs={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
            <BsPeopleFill size={24} className="text-primary mb-2" />
            <h6 className="fw-semibold mb-0">활동도</h6>
            <small className="text-muted">+12% 상승</small>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
            <BsUmbrellaFill size={24} className="text-info mb-2" />
            <h6 className="fw-semibold mb-0">연차 사용</h6>
            <small className="text-muted">5건 처리</small>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
            <BsCashStack size={24} className="text-success mb-2" />
            <h6 className="fw-semibold mb-0">지출 현황</h6>
            <small className="text-muted">총 3,200,000원</small>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
            <BsBarChart size={24} className="text-warning mb-2" />
            <h6 className="fw-semibold mb-0">통계 요약</h6>
            <small className="text-muted">실시간 업데이트</small>
          </Card>
        </Col>
      </Row>

      {/* 그래프 영역 */}
      <Card
        className="shadow-sm border-0 rounded-4 mt-4 mx-2"
        style={{ background: "white" }}
      >
        <Card.Body>
          <h6 className="fw-bold mb-3">전체 요약 그래프</h6>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="활동도" stroke="#4e73df" strokeWidth={2} />
              <Line type="monotone" dataKey="연차" stroke="#36b9cc" strokeWidth={2} />
              <Line type="monotone" dataKey="지출" stroke="#1cc88a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;
