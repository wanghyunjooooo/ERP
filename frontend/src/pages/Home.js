import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Navbar, Spinner } from "react-bootstrap";
import BottomNav from "../components/Nav";
import WorkButton from "../components/WorkButton";
import WorkSummary from "../components/WorkSummary";
import AttendList from "../components/AttendList";
import ApprovalList from "../components/ApprovalList";

function Home() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [rawStatus, setRawStatus] = useState({ status: null, approval_status: null });
  const [today, setToday] = useState("");
  const [user, setUser] = useState(null);
  const [attendList, setAttendList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const monthlyGoal = 160;
  const weeklyGoal = 40;

  // 오늘 날짜 표시용
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

  // ✅ DB status + approval_status → 화면 표시용 변환 함수
  const makeDisplayStatus = (status, approval_status) => {
    if (!status && !approval_status) return "확인중";

    if (status === "출근") {
      if (approval_status === "대기") return "출근 대기";
      if (approval_status === "승인") return "근무";
      return "출근";
    }

    if (status === "퇴근") {
      if (approval_status === "대기") return "퇴근 대기";
      if (approval_status === "승인") return "퇴근";
      return "퇴근";
    }

    if (status === "근무") return "근무";
    return status || "확인중";
  };

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(storedUser);
    axios
      .get(`http://localhost:3000/users/${parsed.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("❌ 사용자 조회 실패:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          requireLogin();
        } else {
          setLoading(false);
        }
      });
  }, []);

  // ✅ 현재 출퇴근 상태 불러오기 (DB 기준)
  const fetchAttendanceStatus = async () => {
    try {
      const token = getToken();
      if (!token || !user) return;

      const res = await axios.get(
        `http://localhost:3000/attend/status/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📡 서버 응답:", res.data);

      // ✅ 배열 응답인 경우 첫 번째 항목 사용
      const latest =
        Array.isArray(res.data) && res.data.length > 0
          ? res.data[0]
          : res.data;

      const { status, approval_status } = latest || {};
     
      setRawStatus({ status, approval_status });
      setCurrentStatus(makeDisplayStatus(status, approval_status));
    } catch (err) {
     
    }
  };

  // ✅ 전체 데이터(근태 목록, 요약) 불러오기
  const fetchAll = async () => {
    const token = getToken();
    if (!token) return requireLogin();
    if (!user) return;

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
      if (err.response?.status === 401 || err.response?.status === 403)
        requireLogin();
    } finally {
      setLoading(false);
    }
  };

  // ✅ 초기 데이터 로드
  useEffect(() => {
    if (!user) return;
    (async () => {
      await fetchAttendanceStatus();
      await fetchAll();
    })();
  }, [user]);

  // ✅ 출퇴근 요청 (버튼에서 호출)
  const handleWorkToggle = async () => {
    if (!user) return requireLogin();
    const token = getToken();
    if (!token) return requireLogin();

    try {
      const s = rawStatus.status;
      const a = rawStatus.approval_status;
      let endpoint = "";

      if (s === "근무" || (s === "출근" && a === "승인")) {
        endpoint = "http://localhost:3000/attend/end";
      } else {
        endpoint = "http://localhost:3000/attend/start";
      }

      const res = await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      const attend = res.data?.attend || res.data;

      if (attend) {
        const { status, approval_status } = attend;
       
        setRawStatus({ status, approval_status });
        setCurrentStatus(makeDisplayStatus(status, approval_status));
      } else {
        // 응답이 없으면 강제로 다시 조회
        await fetchAttendanceStatus();
      }

      // 최신 목록 갱신
      fetchAll();
    } catch (err) {
     
      alert("요청 중 오류가 발생했습니다.");
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
            ERP
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="pt-5 mt-4">
        <h5 className="fw-bold mt-3 mb-2 text-center">
          {user ? `${user.user_name}님 안녕하세요 👋` : "안녕하세요 👋"}
        </h5>
        <p className="text-muted text-center mb-4">{today}</p>

        {/* ✅ WorkButton */}
        <WorkButton
          currentStatus={currentStatus}
          fetchAttendanceStatus={fetchAttendanceStatus}
          token={getToken()}
          onToggle={handleWorkToggle}
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
