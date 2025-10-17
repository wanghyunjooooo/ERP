// src/components/WorkSummary.js
import React, { useEffect, useState } from "react";
import { Card, Row, Col, ProgressBar, Spinner } from "react-bootstrap";
import axios from "axios";

/**
 * WorkSummary
 * - userId: 숫자 (필수) — user가 없으면 '사용자 정보를 불러오는 중' 표시
 *
 * 동작:
 * 1) /attend/summary/monthly/:userId, /attend/summary/weekly/:userId 요청
 * 2) /attend/status/:userId 로 오늘 최신 출퇴근 레코드 가져와서
 *    - 현재 진행중(start_time만 있고 end_time 없거나 status가 출근/근무/지각 등)이라면
 *      실시간 경과시간을 계산해서 월/주 합계에 더해 표시
 *
 * 주의: 백엔드 정책(승인된 것만 합계)에 따라 둘 중 어떤 합계를 보여줄지 결정하세요.
 *       여기서는 "백엔드 합계(승인 기준) + 진행중 실시간(현재 진행)" 방식으로 보여줍니다.
 */

const WorkSummary = ({ userId }) => {
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  // 진행중 보정값 (실시간)
  const [liveHours, setLiveHours] = useState(0);
  const [liveActive, setLiveActive] = useState(false);

  const monthlyGoal = 160;
  const weeklyGoal = 40;

  useEffect(() => {
    // userId 체크
    if (!userId) {
      console.warn("⚠️ [WorkSummary] userId 없음 — API 요청 중단");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ [WorkSummary] 토큰 없음 — 요청 중단");
      setLoading(false);
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAll = async () => {
      try {
        setLoading(true);
        setLiveHours(0);
        setLiveActive(false);

        console.log("📡 [근무시간 요약 요청 시작] userId:", userId);

        // 1) 월간/주간 합계 (백엔드)
        const [monthlyRes, weeklyRes] = await Promise.all([
          axios.get(`http://localhost:3000/attend/summary/monthly/${userId}`, config),
          axios.get(`http://localhost:3000/attend/summary/weekly/${userId}`, config),
        ]);

        if (cancelled) return;

        console.log("✅ [월간 응답 데이터]", monthlyRes.data);
        console.log("✅ [주간 응답 데이터]", weeklyRes.data);

        const monthHours = parseFloat(monthlyRes.data.total_hours) || 0;
        const weekHours = parseFloat(weeklyRes.data.total_hours) || 0;

        setMonthlyHours(monthHours);
        setWeeklyHours(weekHours);

        // 2) 오늘 최신 출퇴근 레코드 조회 — 실시간 보정용
        try {
          const statusRes = await axios.get(`http://localhost:3000/attend/status/${userId}`, config);
          if (cancelled) return;

          // statusRes.data 가 배열일 수도 있고 객체일 수도 있음 — 최신 레코드 사용
          const latest = Array.isArray(statusRes.data) && statusRes.data.length > 0
            ? statusRes.data[0]
            : statusRes.data;

          console.log("📡 [오늘 최신 출퇴근 레코드]", latest);

          if (latest) {
            const { start_time, end_time, status, approval_status } = latest;

            // 근무중으로 판단할 조건:
            // - end_time이 없고 start_time이 존재
            // - 또는 status가 '출근'|'근무'|'지각' 등
            const isOngoing = (
              (start_time && !end_time) ||
              status === "출근" ||
              status === "근무" ||
              approval_status === "지각"
            );

            if (isOngoing && start_time) {
              // start_time은 DB TIME 형태 (예: "09:12:34") — 오늘 날짜와 합쳐서 계산
              // start_time may be returned as string or time object. Ensure string.
              const startTimeStr = typeof start_time === "string"
                ? start_time
                : (start_time && start_time.toString());

              // Build ISO time for today in local timezone:
              const now = new Date();
              const todayDate = now.toISOString().split("T")[0]; // YYYY-MM-DD in UTC — we'll parse using local interpretation
              // To robustly parse DB time (which is TIME without timezone), combine with today's date in local timezone:
              // Create a Date object using current date components and start_time components
              const [h, m, s] = (startTimeStr || "00:00:00").split(":").map((v) => parseInt(v, 10));
              const startDateLocal = new Date();
              startDateLocal.setHours(h || 0, m || 0, s || 0, 0);

              // If start time is in the future (midnight-crossing issues), try fallback by using UTC parsing:
              // But generally using setHours is correct for local TIME values.

              const diffMs = now - startDateLocal;
              const diffHours = Math.max(diffMs / 1000 / 3600, 0); // in hours

              // Round to 2 decimals
              const live = Math.round(diffHours * 100) / 100;

              if (!cancelled) {
                setLiveHours(live);
                setLiveActive(true);
              }
            } else {
              if (!cancelled) {
                setLiveHours(0);
                setLiveActive(false);
              }
            }
          }
        } catch (statusErr) {
          console.warn("⚠️ [WorkSummary] 오늘 출퇴근 상태 조회 실패:", statusErr);
          // 그냥 무시 — 이미 합계는 표시됨
          if (!cancelled) {
            setLiveHours(0);
            setLiveActive(false);
          }
        }
      } catch (err) {
        console.error("❌ [WorkSummary] 근무시간 요약 조회 실패:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();

    // cleanup
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // userId 아직 안 들어온 경우
  if (!userId) {
    return (
      <Card className="shadow-sm mb-4 p-3 rounded-4 border-0 text-center text-muted">
        사용자 정보를 불러오는 중입니다...
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="shadow-sm mb-4 p-3 rounded-4 border-0 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        근무 시간 불러오는 중...
      </Card>
    );
  }

  // 합계에 live 보정 추가 (표시용)
  const displayedMonthly = Math.round((monthlyHours + (liveActive ? liveHours : 0)) * 100) / 100;
  const displayedWeekly = Math.round((weeklyHours + (liveActive ? liveHours : 0)) * 100) / 100;

  return (
    <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
      <Card.Title className="fw-semibold mb-3 text-center">
        근무 시간 현황
      </Card.Title>

      <Row>
        <Col xs={12} className="mb-3">
          <p className="mb-1 text-muted small">이번달 총 근무시간</p>
          <ProgressBar
            now={Math.min((displayedMonthly / monthlyGoal) * 100, 100)}
            label={`${displayedMonthly.toFixed(2)}h / ${monthlyGoal}h${liveActive ? ` (실시간 +${liveHours.toFixed(2)}h)` : ""}`}
            style={{ height: "22px", borderRadius: "10px" }}
          />
        </Col>

        <Col xs={12}>
          <p className="mb-1 text-muted small">이번주 근무시간</p>
          <ProgressBar
            now={Math.min((displayedWeekly / weeklyGoal) * 100, 100)}
            label={`${displayedWeekly.toFixed(2)}h / ${weeklyGoal}h${liveActive ? ` (실시간 +${liveHours.toFixed(2)}h)` : ""}`}
            variant="info"
            style={{ height: "22px", borderRadius: "10px" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WorkSummary;
