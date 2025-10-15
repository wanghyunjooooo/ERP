import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Row, Col, ProgressBar, Navbar } from "react-bootstrap";
import BottomNav from "../components/Nav";

function Home() {
  const [isWorking, setIsWorking] = useState(false);
  const [today, setToday] = useState("");
  const [user, setUser] = useState(null);
  const [totalHours, setTotalHours] = useState(120);
  const maxHours = 160;
  const [attendId, setAttendId] = useState(null); // ✅ 오늘 출근한 기록 ID 저장

  // 오늘 날짜 포맷
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

  // 사용자 정보 조회
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.user_id;

    if (!token || !userId) {
      console.error("토큰 또는 사용자 정보가 없습니다.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        console.log("✅ 개별 사원 정보:", res.data);
      } catch (err) {
        console.error("❌ 사원 조회 실패:", err);
      }
    };

    fetchUser();
  }, []);

  // 오늘 출근 기록 확인
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");

    const checkTodayAttend = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/attend/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 오늘 날짜의 출근 기록이 있는지 확인
        const todayStr = new Date().toISOString().split("T")[0];
        const todayAttend = res.data.find(a => a.attend_date.startsWith(todayStr));

        if (todayAttend) {
          setIsWorking(!todayAttend.end_time); // end_time이 없으면 근무중
          setAttendId(todayAttend.attend_id);
        }
      } catch (err) {
        console.log("출퇴근 데이터 없음 (정상)", err);
      }
    };

    checkTodayAttend();
  }, [user]);

  // 출퇴근 버튼 클릭
  const handleWorkToggle = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const now = new Date();
    const attend_date = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];

    try {
      if (!isWorking) {
        // ✅ 출근하기
        const res = await axios.post(
          "http://localhost:3000/attend",
          {
            attend_date,
            start_time: timeStr,
            status: "근무중",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ 출근 등록 완료:", res.data);
        setAttendId(res.data.attend.attend_id);
        setIsWorking(true);
      } else {
        // ✅ 퇴근하기
        if (!attendId) {
          console.error("출근 기록이 없습니다.");
          return;
        }
        const res = await axios.put(
          `http://localhost:3000/attend/${attendId}`,
          {
            end_time: timeStr,
            status: "퇴근",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ 퇴근 등록 완료:", res.data);
        setIsWorking(false);
      }
    } catch (err) {
      console.error("❌ 출퇴근 처리 실패:", err);
      alert("출퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f7f9fc", minHeight: "100vh", paddingBottom: "70px" }}>
      {/* 상단 네비게이션 */}
      <Navbar
        fixed="top"
        style={{
          background: "linear-gradient(135deg, #74ABE2, #5563DE)",
          color: "white",
        }}
        className="shadow-sm"
      >
        <Container className="justify-content-center">
          <Navbar.Brand className="text-white fw-bold fs-5 mb-0">ERP</Navbar.Brand>
        </Container>
      </Navbar>

      {/* 메인 콘텐츠 */}
      <Container className="pt-5 mt-4">
        <h5 className="fw-bold mt-3 mb-2 text-center">
          {user ? `${user.user_name}님 안녕하세요 👋` : "안녕하세요 👋"}
        </h5>
        <p className="text-muted text-center mb-4">{today}</p>

        {/* 출근/퇴근 카드 */}
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

        {/* 근무 시간 현황 */}
        <Card className="shadow-sm mb-4 p-3 rounded-4 border-0">
          <Card.Title className="fw-semibold mb-3 text-center">근무 시간 현황</Card.Title>
          <Row>
            <Col xs={12} className="mb-3">
              <p className="mb-1 text-muted small">이번달 총 근무시간</p>
              <ProgressBar
                now={(totalHours / maxHours) * 100}
                label={`${totalHours}h / ${maxHours}h`}
                style={{ height: "22px", borderRadius: "10px" }}
              />
            </Col>
            <Col xs={12}>
              <p className="mb-1 text-muted small">이번주 근무시간</p>
              <ProgressBar
                now={70}
                label="35h / 40h"
                variant="info"
                style={{ height: "22px", borderRadius: "10px" }}
              />
            </Col>
          </Row>
        </Card>

        {/* 내 정보 카드 */}
        {user && (
          <Card className="shadow-sm p-3 rounded-4 border-0 mb-4">
            <Card.Title className="fw-semibold mb-3 text-center">내 정보</Card.Title>
            <p><strong>이름:</strong> {user.user_name}</p>
            <p><strong>이메일:</strong> {user.user_email}</p>
            <p><strong>권한:</strong> {user.user_auth}</p>
            <p><strong>입사일:</strong> {new Date(user.join_date).toLocaleDateString()}</p>
          </Card>
        )}
      </Container>

      {/* 하단 탭바 */}
      <BottomNav />
    </div>
  );
}

export default Home;
