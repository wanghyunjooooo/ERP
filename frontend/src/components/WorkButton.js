import React, { useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const WorkButton = ({ currentStatus, fetchAttendanceStatus, onToggle }) => {

  let buttonText = "출근하기";
  let buttonVariant = "success";
  let buttonDisabled = false;

  // ✅ 상태별 버튼 표시 제어
  switch (currentStatus) {
    case "출근 대기":
      buttonText = "출근 승인 대기 중";
      buttonVariant = "secondary";
      buttonDisabled = true;
      break;
    case "퇴근 대기":
      buttonText = "퇴근 승인 대기 중";
      buttonVariant = "secondary";
      buttonDisabled = true;
      break;
    case "근무":
      buttonText = "퇴근하기";
      buttonVariant = "danger";
      break;
    case "퇴근":
      buttonText = "출근하기";
      buttonVariant = "success";
      break;
    default:
      buttonText = "출근하기";
      buttonVariant = "success";
  }

  const handleClick = async () => {
    await onToggle(); // ✅ Home.js의 handleWorkToggle 실행
    await fetchAttendanceStatus(); // ✅ 상태 갱신
  };

  useEffect(() => {
    console.log("🔁 [useEffect] currentStatus 변경 감지:", currentStatus);
  }, [currentStatus]);

  return (
    <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
      <Card.Title className="fw-semibold mb-3 text-center">출근 / 퇴근</Card.Title>

      <div className="text-center">
        <Button
          variant={buttonVariant}
          className="rounded-3 px-4 py-2 fw-semibold"
          onClick={handleClick}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>

        <p className="mt-3 text-muted mb-0">
          현재 상태:{" "}
          <strong
            style={{
              color:
                currentStatus === "출근 대기"
                  ? "orange"
                  : currentStatus === "근무"
                  ? "red"
                  : currentStatus === "퇴근 대기"
                  ? "orange"
                  : currentStatus === "퇴근"
                  ? "gray"
                  : "green",
            }}
          >
            {currentStatus || "확인 중..."}
          </strong>
        </p>
      </div>
    </Card>
  );
};

export default WorkButton;
