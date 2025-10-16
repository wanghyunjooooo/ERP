import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const AttendList = ({ attendList }) => (
  <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
    <Card.Title className="fw-semibold mb-3 text-center">내 출퇴근 내역</Card.Title>
    {attendList.length === 0 ? (
      <div className="text-center text-muted py-3">출퇴근 내역이 없습니다.</div>
    ) : (
      <ListGroup variant="flush">
        {attendList.map((a) => (
          <ListGroup.Item key={a.attend_id}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">
                  {new Date(a.attend_date).toISOString().split("T")[0]}
                </div>
                <div className="text-muted small">
                  출근 {a.start_time || "-"} / 퇴근 {a.end_time || "-"}
                </div>
                <div className="text-muted small">
                  총 근무시간: {a.total_hours}시간
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold">
                  {a.status} ({a.approval_status})
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Card>
);

export default AttendList;
