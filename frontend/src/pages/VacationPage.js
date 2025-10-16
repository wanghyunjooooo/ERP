import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import BottomNav from "../components/Nav";
import { BsCalendar4Week, BsClipboardCheck } from "react-icons/bs";
import Header from "../components/Header";

function VacationPage({ onMenuSelect }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("연차");
  const [loading, setLoading] = useState(false);
  const [leaveList, setLeaveList] = useState([]);
  const [fetching, setFetching] = useState(false);

  const getToken = () => localStorage.getItem("token");

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
    } catch {
      return null;
    }
  };

  // ✅ 내 휴가 목록 조회
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

  useEffect(() => {
    fetchMyLeaveList();
  }, []);

  // ✅ 휴가 신청
  const handleApply = async () => {
    if (!startDate) {
      alert("시작일을 선택해주세요!");
      return;
    }

    const appliedEndDate = leaveType === "반차" ? startDate : endDate;

    if (leaveType === "연차" && !endDate) {
      alert("종료일을 선택해주세요!");
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
          end_date: appliedEndDate,
          reason,
          leave_type: leaveType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const message = response.data?.message || "휴가 신청 완료";
      alert(`✅ ${message}`);
      fetchMyLeaveList();
      setStartDate("");
      setEndDate("");
      setReason("");
      setLeaveType("연차");
    } catch (err) {
      console.error("❌ 휴가 신청 실패:", err);
      const msg = err.response?.data?.error || err.message;
      alert(`❌ 휴가 신청 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!startDate) return 0;
    if (leaveType === "반차") return 0.5;
    if (!endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const requestedDays = calculateDays();

  return (
    <>
      <Header />
      <div
        className="d-flex flex-column align-items-center justify-content-start"
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          paddingBottom: "100px",
          paddingTop: "80px",
        }}
      >
        {/* ✅ 휴가 신청 */}
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
              <BsCalendar4Week className="me-2 text-primary" /> 휴가 신청
            </h5>

            <Form.Group className="mb-3">
              <Form.Label>휴가 종류</Form.Label>
              <Form.Select
                value={leaveType}
                onChange={(e) => {
                  const type = e.target.value;
                  setLeaveType(type);
                  if (type === "반차" && startDate) setEndDate(startDate);
                }}
                disabled={loading}
              >
                <option value="연차">연차</option>
                <option value="반차">반차</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>시작일</Form.Label>
                <Form.Control
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={startDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStartDate(val);
                    if (leaveType === "반차") setEndDate(val);
                  }}
                  disabled={loading}
                />
              </Col>
              <Col>
                <Form.Label>종료일</Form.Label>
                <Form.Control
                  type="date"
                  min={startDate || new Date().toISOString().split("T")[0]}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={leaveType === "반차" || !startDate || loading}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>사유</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="휴가 사유를 입력하세요."
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
            </Card>

            <Button
              onClick={handleApply}
              className="w-100 rounded-pill py-2 fw-bold"
              variant="primary"
              disabled={loading}
            >
              <BsClipboardCheck className="me-2" />
              {loading ? "신청 중..." : "휴가 신청하기"}
            </Button>
          </Card.Body>
        </Card>

        {/* ✅ 내 휴가 내역 (디자인 개선 완료) */}
        <Card
          className="shadow-sm border-0 mt-3"
          style={{ width: "92%", borderRadius: "20px", background: "#fff" }}
        >
          <Card.Body>
            <h5 className="fw-bold mb-3 text-secondary d-flex align-items-center">
              <BsClipboardCheck className="me-2" /> 내 휴가 내역
            </h5>

            {fetching ? (
              <div className="text-center text-muted py-3">불러오는 중...</div>
            ) : leaveList.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {leaveList.map((leave) => (
                  <Card
                    key={leave.leave_id}
                    className="border-0 shadow-sm rounded-4 px-3 py-2"
                    style={{
                      backgroundColor: "#fdfdfd",
                      borderLeft:
                        leave.approval_status === "승인"
                          ? "5px solid #28a745"
                          : leave.approval_status === "대기"
                          ? "5px solid #ffc107"
                          : "5px solid #dc3545",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0 text-primary">
                        {leave.leave_type} 신청
                      </h6>
                      <span
                        className="badge px-3 py-1"
                        style={{
                          backgroundColor:
                            leave.approval_status === "승인"
                              ? "#d4edda"
                              : leave.approval_status === "대기"
                              ? "#fff3cd"
                              : "#f8d7da",
                          color:
                            leave.approval_status === "승인"
                              ? "#155724"
                              : leave.approval_status === "대기"
                              ? "#856404"
                              : "#721c24",
                        }}
                      >
                        {leave.approval_status}
                      </span>
                    </div>

                    <div className="small text-muted" style={{ lineHeight: "1.5" }}>
                      <div>
                        🗓 <strong>기간:</strong>{" "}
                        {new Date(leave.start_date).toLocaleDateString("ko-KR")}
                        {leave.start_date !== leave.end_date &&
                          ` ~ ${new Date(leave.end_date).toLocaleDateString("ko-KR")}`}
                      </div>
                      <div>
                        💬 <strong>사유:</strong> {leave.reason || "없음"}
                      </div>
                      <div>
                        📅 <strong>신청일:</strong>{" "}
                        {new Date(leave.applied_at).toLocaleString("ko-KR")}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted text-center py-3">
                휴가 내역이 없습니다.
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
