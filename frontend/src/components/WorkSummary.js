import React from "react";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";

const WorkSummary = ({ monthlyHours, weeklyHours, monthlyGoal, weeklyGoal }) => (
  <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
    <Card.Title className="fw-semibold mb-3 text-center">근무 시간 현황</Card.Title>
    <Row>
      <Col xs={12} className="mb-3">
        <p className="mb-1 text-muted small">이번달 총 근무시간</p>
        <ProgressBar
          now={(monthlyHours / monthlyGoal) * 100}
          label={`${monthlyHours}h / ${monthlyGoal}h`}
          style={{ height: "22px", borderRadius: "10px" }}
        />
      </Col>
      <Col xs={12}>
        <p className="mb-1 text-muted small">이번주 근무시간</p>
        <ProgressBar
          now={(weeklyHours / weeklyGoal) * 100}
          label={`${weeklyHours}h / ${weeklyGoal}h`}
          variant="info"
          style={{ height: "22px", borderRadius: "10px" }}
        />
      </Col>
    </Row>
  </Card>
);

export default WorkSummary;
