import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Navbar, Spinner } from "react-bootstrap";
import BottomNav from "../components/Nav";
import WorkButton from "../components/WorkButton";
import WorkSummary from "../components/WorkSummary";
import AttendList from "../components/AttendList";
import ApprovalList from "../components/ApprovalList";

function Home() {
  // 상태들
  const [isWorking, setIsWorking] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(""); // ✅ 추가
  const [currentStatus, setCurrentStatus] = useState("");
  const [today, setToday] = useState("");
  const [user, setUser] = useState(null);
  const [attendList, setAttendList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const monthlyGoal = 160;
  const weeklyGoal = 40;

  // 오늘 날짜
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

  const getToken = () => localStorage.getItem("token");
  const requireLogin = () => {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/login";
  };

  // 사용자 정보
  useEffect(() => {
    const token = getToken();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3000/users/${storedUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("❌ 사용자 조회 실패:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          requireLogin();
        } else {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (user) {
      fetchAll();
      checkCurrentStatus();
    }
  }, [user]);

  // ✅ 현재 근무 상태
  const checkCurrentStatus = async () => {
    try {
      const token = getToken();
      if (!token || !user) return;
      const res = await axios.get(
        `http://localhost:3000/attend/status/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { status, approval_status } = res.data || {};
      setCurrentStatus(status);
      setApprovalStatus(approval_status || ""); // ✅ approval_status 추적

      // 상태 조합 로직
      if (approval_status === "대기") {
        setIsWorking("pending"); // 승인 대기
      } else if (["출근", "근무 중"].includes(status)) {
        setIsWorking(true); // 근무 중
      } else {
        setIsWorking(false); // 퇴근 상태
      }
    } catch (err) {
      console.error("❌ 현재 상태 조회 실패:", err);
    }
  };

  // ✅ 전체 데이터 로드
  const fetchAll = async () => {
    const token = getToken();
    if (!token) return requireLogin();

    try {
      setLoading(true);
      const userId = user.user_id;
      const [attendRes, monthRes, weekRes] = await Promise.all([
        axios.get(`http://localhost:3000/attend/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:3000/attend/summary/monthly/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:3000/attend/summary/weekly/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const attendData = attendRes.data || [];
      setAttendList(attendData);
      setApprovalList(attendData.filter((a) => a.approval_status === "대기"));
      setMonthlyHours(Number(monthRes.data?.total_hours || 0));
      setWeeklyHours(Number(weekRes.data?.total_hours || 0));
    } catch (err) {
      console.error("❌ 데이터 로드 실패:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403))
        requireLogin();
    } finally {
      setLoading(false);
    }
  };

  // ✅ 출퇴근 처리
  const handleWorkToggle = async () => {
    if (!user) return requireLogin();
    const token = getToken();
    if (!token) return requireLogin();

    try {
      if (!isWorking) {
        // 출근
        const res = await axios.post(
          "http://localhost:3000/attend/start",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`✅ 출근 완료!\n출근시간: ${res.data.attend.start_time}`);
        setIsWorking(true);
        setApprovalStatus("승인");
      } else {
        // 퇴근
        const res = await axios.post(
          "http://localhost:3000/attend/end",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const approval = res.data.attend.approval_status || "대기";
        if (approval === "대기") {
          alert("✅ 퇴근 요청이 등록되었습니다. 승인 대기 중입니다.");
          setApprovalStatus("대기");
          setIsWorking("pending");
        } else {
          alert(
            `✅ 퇴근 완료!\n퇴근시간: ${res.data.attend.end_time}\n총 근무시간: ${res.data.attend.total_hours}시간`
          );
          setApprovalStatus("승인");
          setIsWorking(false);
        }
      }

      setTimeout(() => {
        fetchAll();
        checkCurrentStatus();
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert(msg || "출퇴근 처리 오류 발생");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">데이터 불러오는 중...</p>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        paddingBottom: "70px",
      }}
    >
      <Navbar
        fixed="top"
        style={{
          background: "linear-gradient(135deg, #74ABE2, #5563DE)",
          color: "white",
        }}
        className="shadow-sm"
      >
        <Container className="justify-content-center">
          <Navbar.Brand className="text-white fw-bold fs-5 mb-0">
            ERP 근태관리
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="pt-5 mt-4">
        <h5 className="fw-bold mt-3 mb-2 text-center">
          {user ? `${user.user_name}님 안녕하세요 👋` : "안녕하세요 👋"}
        </h5>
        <p className="text-muted text-center mb-4">{today}</p>

        {/* ✅ 수정된 부분 — approvalStatus 함께 전달 */}
        <WorkButton
          isWorking={isWorking}
          approvalStatus={approvalStatus}
          currentStatus={currentStatus}
          handleWorkToggle={handleWorkToggle}
        />

        <WorkSummary
          monthlyHours={monthlyHours}
          weeklyHours={weeklyHours}
          monthlyGoal={monthlyGoal}
          weeklyGoal={weeklyGoal}
        />
        <AttendList attendList={attendList} />
        <ApprovalList approvalList={approvalList} />
      </Container>

      <BottomNav />
    </div>
  );
}

export default Home;
