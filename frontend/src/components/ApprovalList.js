import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const ApprovalList = ({ approvalList }) => (
  <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
    <Card.Title className="fw-semibold mb-3 text-center">승인 대기 내역</Card.Title>
    {approvalList.length === 0 ? (
      <div className="text-center text-muted py-3">
        승인 대기 중인 내역이 없습니다.
      </div>
    ) : (
      <ListGroup variant="flush">
        {approvalList.map((a) => (
          <ListGroup.Item key={a.attend_id}>
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-semibold">
                  {new Date(a.attend_date).toISOString().split("T")[0]}
                </div>
                <div className="text-muted small">
                  출근 {a.start_time || "-"} / 퇴근 {a.end_time || "-"}
                </div>
              </div>
              <div className="fw-bold text-warning">{a.approval_status}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Card>
);

export default ApprovalList;
