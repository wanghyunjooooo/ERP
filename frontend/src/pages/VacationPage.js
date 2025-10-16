import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  ProgressBar,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import BottomNav from "../components/Nav";
import { BsCalendar4Week, BsClipboardCheck } from "react-icons/bs";
import Header from "../components/Header";

function VacationPage({ onMenuSelect }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [usedDays, setUsedDays] = useState(7);
  const [totalDays, setTotalDays] = useState(15);
  const [loading, setLoading] = useState(false);
  const [leaveList, setLeaveList] = useState([]); // ✅ 자동 조회된 연차 목록
  const [fetching, setFetching] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // ✅ 토큰에서 user_id 추출 (JWT payload decode)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // ✅ 내 연차 목록 자동 조회
  const fetchMyLeaveList = async () => {
    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    const decoded = parseJwt(token);
    const userId = decoded?.user_id;

    if (!userId) {
      alert("유저 정보를 불러올 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      setFetching(true);
      const response = await axios.get(`http://localhost:3000/leave/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setLeaveList(data);
      } else if (Array.isArray(data.result)) {
        setLeaveList(data.result);
      } else {
        setLeaveList([]);
      }
    } catch (err) {
      console.error("❌ 연차 조회 실패:", err);
      const msg = err.response?.data?.error || err.message;
      alert(`❌ 연차 조회 실패: ${msg}`);
    } finally {
      setFetching(false);
    }
  };

  // ✅ 페이지 로드 시 자동 실행
  useEffect(() => {
    fetchMyLeaveList();
  }, []);

  // ✅ 연차 신청
  const handleApply = async () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택해주세요!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/leave",
        {
          start_date: startDate,
          end_date: endDate,
          reason,
          leave_type: "연차",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data?.result;
      const message = response.data?.message || "연차 신청 완료";

      alert(`✅ ${message}`);
      // ✅ 신청 후 자동 갱신
      fetchMyLeaveList();

      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      console.error("❌ 연차 신청 실패:", err);
      const msg = err.response?.data?.error || err.message;
      alert(`❌ 연차 신청 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 연차 일수 계산
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const requestedDays = calculateDays();
  const remainingDays = totalDays - usedDays - requestedDays;

  return (
    <>
      <Header />
      <div
        className="d-flex flex-column align-items-center justify-content-start"
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          paddingBottom: "100px",
          paddingTop: "20px",
        }}
      >
        {/* ✅ 연차 신청 */}
        <Card
          className="shadow-sm border-0"
          style={{
            width: "92%",
            borderRadius: "20px",
            background: "#ffffff",
          }}
        >
          <Card.Body>
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <BsCalendar4Week className="me-2 text-primary" /> 연차 신청
            </h5>

            <Row className="mb-3">
              <Col>
                <Form.Label>시작일</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                />
              </Col>
              <Col>
                <Form.Label>종료일</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>사유</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="연차 사용 사유를 입력하세요."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Card className="border-0 shadow-sm p-3 mb-3">
              <div className="d-flex justify-content-between">
                <span>신청 일수</span>
                <strong className="text-primary">{requestedDays}일</strong>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span>남은 연차</span>
                <strong className="text-success">{remainingDays}일</strong>
              </div>
              <ProgressBar
                now={(usedDays / totalDays) * 100}
                className="mt-3"
                variant="info"
              />
              <small className="text-muted">
                사용 {usedDays}일 / 총 {totalDays}일
              </small>
            </Card>

            <Button
              onClick={handleApply}
              className="w-100 rounded-pill py-2 fw-bold"
              variant="primary"
              disabled={loading}
            >
              <BsClipboardCheck className="me-2" />
              {loading ? "신청 중..." : "연차 신청하기"}
            </Button>
          </Card.Body>
        </Card>

        {/* ✅ 내 연차 목록 자동 표시 */}
        <Card
          className="shadow-sm border-0 mt-3"
          style={{ width: "92%", borderRadius: "20px", background: "#fff" }}
        >
          <Card.Body>
            <h5 className="fw-bold mb-3 text-secondary">내 연차 내역</h5>

            {fetching ? (
              <div className="text-center text-muted">불러오는 중...</div>
            ) : leaveList.length > 0 ? (
              <ListGroup variant="flush">
                {leaveList.map((leave) => (
                  <ListGroup.Item
                    key={leave.leave_id}
                    className="border-0 shadow-sm mb-3 rounded-3"
                  >
                  
              
                    <div>
                      🗓 {new Date(leave.start_date).toLocaleDateString()} ~{" "}
                      {new Date(leave.end_date).toLocaleDateString()}
                    </div>
                    <div>💬 사유: {leave.reason}</div>
                    <div
                      style={{
                        color:
                          leave.approval_status === "승인"
                            ? "green"
                            : leave.approval_status === "대기"
                            ? "orange"
                            : "red",
                      }}
                    >
                      승인 상태: {leave.approval_status}
                    </div>
                    <small className="text-muted">
                      신청일:{" "}
                      {new Date(leave.applied_at).toLocaleString("ko-KR")}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-muted text-center">
                연차 내역이 없습니다.
              </div>
            )}
          </Card.Body>
        </Card>

        <BottomNav onMenuSelect={onMenuSelect} />
      </div>
    </>
  );
}

export default VacationPage;
