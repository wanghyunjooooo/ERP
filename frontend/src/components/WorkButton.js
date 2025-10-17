import React, { useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const WorkButton = ({
  currentStatus,
  approvalStatus, // ✅ approval_status 값도 함께 받아옴
  fetchAttendanceStatus,
  onToggle,
}) => {
  // ✅ 출근인데 approvalStatus가 '지각'이면 지각으로 처리
  const effectiveStatus =
    currentStatus === "출근" && approvalStatus === "지각"
      ? "지각"
      : currentStatus;

  let buttonText = "출근하기";
  let buttonVariant = "success";
  let buttonDisabled = false;

  // ✅ 상태별 버튼 표시 제어
  switch (effectiveStatus) {
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
    case "지각": // ✅ 지각도 근무로 간주
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

  // ✅ 버튼 클릭 시 처리
  const handleClick = async () => {
    await onToggle(); // Home.js의 출근/퇴근 토글 실행

    // DB 반영 시간 확보 (지각 → 근무 반영 대기)
    await new Promise((resolve) => setTimeout(resolve, 300));

    await fetchAttendanceStatus(); // 상태 새로고침
  };

  useEffect(() => {
    console.log("🔁 [useEffect] 상태 변경 감지:", {
      currentStatus,
      approvalStatus,
      effectiveStatus,
    });
  }, [currentStatus, approvalStatus]);

  return (
    <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
      <Card.Title className="fw-semibold mb-3 text-center">
        출근 / 퇴근
      </Card.Title>

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
                effectiveStatus === "출근 대기"
                  ? "orange"
                  : effectiveStatus === "근무" || effectiveStatus === "지각"
                  ? "red"
                  : effectiveStatus === "퇴근 대기"
                  ? "orange"
                  : effectiveStatus === "퇴근"
                  ? "gray"
                  : "green",
            }}
          >
            {effectiveStatus && effectiveStatus !== "확인 중..."
              ? effectiveStatus
              : "퇴근"}
          </strong>
        </p>
      </div>
    </Card>
  );
};

export default WorkButton;
