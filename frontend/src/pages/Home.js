import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ProgressBar,
  Navbar,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import BottomNav from "../components/Nav";

function Home() {
  const [isWorking, setIsWorking] = useState(false);
  const [today, setToday] = useState("");
  const [user, setUser] = useState(null);
  const [attendId, setAttendId] = useState(null);
  const [attendList, setAttendList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const monthlyGoal = 160;
  const weeklyGoal = 40;

  // 오늘 날짜 표시
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

  // 사용자 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !storedUser) return;

    axios
      .get(`http://localhost:3000/users/${storedUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("❌ 사용자 조회 실패:", err));
  }, []);

  // 출퇴근 내역 / 근무시간 / 승인내역 한 번에 로드
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const userId = user.user_id;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [attendRes, monthRes, weekRes, approvalRes] = await Promise.all([
          axios.get(`http://localhost:3000/attend/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/attend/summary/monthly/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/attend/summary/weekly/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/attend/approval/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 출퇴근 내역
        const attendData = attendRes.data || [];
        setAttendList(attendData);

        // 오늘 출근 상태 확인
        const todayStr = new Date().toISOString().split("T")[0];
        const todayAttend = attendData.find(
          (a) => a.attend_date.split("T")[0] === todayStr
        );
        if (todayAttend) {
          setIsWorking(!todayAttend.end_time);
          setAttendId(todayAttend.attend_id);
        } else {
          setIsWorking(false);
          setAttendId(null);
        }

        // 근무시간
        setMonthlyHours(Number(monthRes.data?.total_hours || 0));
        setWeeklyHours(Number(weekRes.data?.total_hours || 0));

        // 승인 내역
        const approvalData = approvalRes.data?.attendance
          ? [approvalRes.data.attendance]
          : Array.isArray(approvalRes.data)
          ? approvalRes.data
          : [];
        setApprovalList(approvalData);
      } catch (err) {
        console.error("❌ 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  // 출근 / 퇴근 토글
  const handleWorkToggle = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const now = new Date();
    const attend_date = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];

    try {
      if (!isWorking) {
        // 출근 등록
        const res = await axios.post(
          "http://localhost:3000/attend",
          { attend_date, start_time: timeStr, status: "근무중" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendId(res.data?.attend?.attend_id || null);
        setIsWorking(true);
      } else {
        // 퇴근 처리
        if (!attendId) {
          alert("퇴근 기록이 없습니다.");
          return;
        }
        await axios.put(
          `http://localhost:3000/attend/${attendId}`,
          { end_time: timeStr, status: "퇴근" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWorking(false);
      }
    } catch (err) {
      console.error("❌ 출퇴근 처리 실패:", err);
      alert("출퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">데이터 불러오는 중...</p>
      </div>
    );

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh", paddingBottom: "70px" }}>
      <Navbar
        fixed="top"
        style={{ background: "linear-gradient(135deg, #74ABE2, #5563DE)", color: "white" }}
        className="shadow-sm"
      >
        <Container className="justify-content-center">
          <Navbar.Brand className="text-white fw-bold fs-5 mb-0">ERP</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="pt-5 mt-4">
        <h5 className="fw-bold mt-3 mb-2 text-center">
          {user ? `${user.user_name}님 안녕하세요 👋` : "안녕하세요 👋"}
        </h5>
        <p className="text-muted text-center mb-4">{today}</p>

        {/* 출퇴근 버튼 */}
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

        {/* 근무시간 현황 */}
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

        {/* ✅ 출퇴근 내역 */}
        <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">내 출퇴근 내역</Card.Title>
          {attendList.length === 0 ? (
            <div className="text-center text-muted py-3">출퇴근 내역이 없습니다.</div>
          ) : (
            <ListGroup variant="flush">
              {attendList.map((a) => (
                <ListGroup.Item key={a.attend_id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-semibold">{a.attend_date.split("T")[0]}</div>
                      <div className="text-muted small">
                        출근 {a.start_time || "-"} / 퇴근 {a.end_time || "-"}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">상태</div>
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

        {/* ✅ 승인 내역 */}
        <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">승인 내역</Card.Title>
          {approvalList.length === 0 ? (
            <div className="text-center text-muted py-3">승인 요청 내역이 없습니다.</div>
          ) : (
            <ListGroup variant="flush">
              {approvalList.map((a) => (
                <ListGroup.Item key={a.attendance_id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-semibold">
                        {a.type === "check_in" ? "출근" : "퇴근"} 요청
                      </div>
                      <div className="text-muted small">
                        요청일: {new Date(a.time).toLocaleString("ko-KR")}
                      </div>
                    </div>
                    <div className="text-end fw-bold">
                      {a.status === "approved"
                        ? "승인됨"
                        : a.status === "rejected"
                        ? "반려됨"
                        : "대기중"}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </Container>

      <BottomNav />
    </div>
  );
}

export default Home;
