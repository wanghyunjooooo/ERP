import React from "react";
import { Card, Button } from "react-bootstrap";

/**
 * props:
 *  - isWorking: boolean ("true" = 근무 중 / false = 퇴근 상태)
 *  - approvalStatus: string ("대기", "승인", "거절" 등)
 *  - currentStatus: string ("출근", "퇴근", "근무 중" 등)
 *  - handleWorkToggle: function (출퇴근 버튼 클릭 시 실행)
 */

const WorkButton = ({ isWorking, approvalStatus, currentStatus, handleWorkToggle }) => {
  // 🔥 표시될 버튼 텍스트 및 색상 결정
  let buttonText = "출근하기";
  let buttonVariant = "success";
  let buttonDisabled = false;

  if (approvalStatus === "대기") {
    // 승인 대기 중 (버튼 비활성화)
    buttonText = "승인 대기 중";
    buttonVariant = "secondary";
    buttonDisabled = true;
  } else if (approvalStatus === "승인") {
    // 승인 완료된 상태만 출퇴근 가능
    if (isWorking) {
      buttonText = "퇴근하기";
      buttonVariant = "danger";
    } else {
      buttonText = "출근하기";
      buttonVariant = "success";
    }
  } else if (approvalStatus === "거절") {
    buttonText = "승인 거절됨";
    buttonVariant = "warning";
    buttonDisabled = true;
  }

  return (
    <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
      <Card.Title className="fw-semibold mb-3 text-center">출근 / 퇴근</Card.Title>
      <div className="text-center">
        <Button
          variant={buttonVariant}
          className="rounded-3 px-4 py-2 fw-semibold"
          onClick={buttonDisabled ? null : handleWorkToggle}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>

        <p className="mt-3 text-muted mb-0">
          현재 상태:{" "}
          <strong
            style={{
              color:
                approvalStatus === "대기"
                  ? "orange"
                  : currentStatus === "근무 중"
                  ? "red"
                  : currentStatus === "퇴근"
                  ? "gray"
                  : "green",
            }}
          >
            {approvalStatus === "대기"
              ? "승인 대기 중"
              : currentStatus || "확인 중..."}
          </strong>
        </p>
      </div>
    </Card>
  );
};

export default WorkButton;
