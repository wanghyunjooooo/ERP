import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Nav,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState([]);
  const [newEmp, setNewEmp] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    birthday: "",
    join_date: "",
    dept_id: "",
    user_auth: "직원",
  });

  // ✅ 직원 목록 조회
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🟢 [직원목록] 요청 URL: http://localhost:3000/users");
      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🟢 [직원목록] 응답 상태:", res.status);

      if (res.status === 403) {
        alert("관리자 권한이 없습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      console.log("🟢 [직원목록] 응답 데이터:", data);

      if (res.ok) setEmployees(data);
      else alert(data.error || "직원 조회 실패");
    } catch (err) {
      alert("서버 연결 실패");
      console.error("❌ [직원목록] 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ 직원 추가
  const handleRegister = async () => {
    const {
      user_name,
      user_email,
      user_password,
      birthday,
      join_date,
      dept_id,
      user_auth,
    } = newEmp;

    if (
      !user_name ||
      !user_email ||
      !user_password ||
      !birthday ||
      !join_date ||
      !dept_id
    ) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("🟢 [직원추가] 요청 URL: http://localhost:3000/users/add");

      const res = await fetch("http://localhost:3000/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name,
          user_email,
          user_password,
          birthday,
          join_date,
          dept_id: parseInt(dept_id),
          user_auth,
        }),
      });

      console.log("🟢 [직원추가] 응답 상태:", res.status);
      const data = await res.json();
      console.log("🟢 [직원추가] 응답 데이터:", data);

      if (res.ok) {
        alert("직원 추가 완료!");
        setNewEmp({
          user_name: "",
          user_email: "",
          user_password: "",
          birthday: "",
          join_date: "",
          dept_id: "",
          user_auth: "직원",
        });
        fetchEmployees();
      } else {
        alert(data.error || "직원 추가 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error("❌ [직원추가] 오류:", err);
    }
  };

  // ✅ 권한 토글
  const handleToggleRole = async (user_id, currentRole) => {
    const newRole = currentRole === "관리자" ? "직원" : "관리자";
    if (!window.confirm(`'${newRole}' 권한으로 변경할까요?`)) return;

    try {
      const token = localStorage.getItem("token");
      console.log("🟢 [권한변경] 요청 URL:", `http://localhost:3000/users/${user_id}/auth`);

      const res = await fetch(`http://localhost:3000/users/${user_id}/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_auth: newRole }),
      });

      console.log("🟢 [권한변경] 응답 상태:", res.status);
      const data = await res.json();
      console.log("🟢 [권한변경] 응답 데이터:", data);

      if (res.ok) {
        alert("권한이 변경되었습니다.");
        fetchEmployees();
      } else alert(data.error || "권한 변경 실패");
    } catch (err) {
      alert("서버 오류 발생");
      console.error("❌ [권한변경] 오류:", err);
    }
  };

  // ✅ 출퇴근 승인 처리 (PUT /admin/attend/approval/:id)
  const handleAttendApproval = async (id, status) => {
    const approvalMap = {
      approve: "승인",
      late: "지각",
      reject: "거절",
    };

    const approval_status = approvalMap[status];
    if (!approval_status) return alert("잘못된 요청입니다.");

    if (!window.confirm(`'${approval_status}' 상태로 처리하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/admin/attend/approval/${id}`;
      console.log("🟢 [승인요청] URL:", url);
      console.log("🟢 [승인요청] 토큰:", token);
      console.log("🟢 [승인요청] 바디:", { approval_status });

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approval_status }),
      });

      console.log("🟢 [승인요청] 응답 상태:", res.status);
      const text = await res.text();
      console.log("🟢 [승인요청] 응답 원문:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("⚠️ JSON 파싱 실패: HTML 반환됨");
        alert("서버가 HTML 응답을 반환했습니다 (404 가능성)");
        return;
      }

      if (res.ok) {
        alert(`근태 요청이 '${approval_status}' 처리되었습니다.`);
        fetchApprovals();
      } else {
        alert(data.error || "승인 처리 실패");
      }
    } catch (err) {
      console.error("❌ [승인요청] 오류:", err);
      alert("서버 오류 발생");
    }
  };

  // ✅ 승인 목록 가져오기
  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🟢 [승인목록] 요청 URL: http://localhost:3000/attend");
      const res = await fetch("http://localhost:3000/attend", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🟢 [승인목록] 응답 상태:", res.status);

      if (!res.ok) {
        console.error("❌ 출퇴근 내역 조회 실패");
        return;
      }

      const data = await res.json();
      console.log("🟢 [승인목록] 응답 데이터:", data);

      const formatted = data.map((item) => ({
        id: item.attend_id,
        user_name: item.user_name,
        date: item.attend_date,
        type: "근태",
        status: item.approval_status,
      }));

      setApprovals(formatted);
    } catch (err) {
      console.error("❌ [승인목록] 오류:", err);
      alert("서버 오류");
    }
  };

  useEffect(() => {
    if (activeTab === "approval") fetchApprovals();
  }, [activeTab]);

  // ✅ 그래프 더미 데이터
  const activityData = [
    { name: "월", value: 40 },
    { name: "화", value: 80 },
    { name: "수", value: 65 },
    { name: "목", value: 90 },
    { name: "금", value: 75 },
  ];
  const leaveData = [
    { name: "1월", value: 3 },
    { name: "2월", value: 5 },
    { name: "3월", value: 2 },
  ];
  const expenseData = [
    { name: "1월", value: 200 },
    { name: "2월", value: 150 },
    { name: "3월", value: 300 },
  ];

  return (
    <Container
      fluid
      className="py-3"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        maxWidth: "430px",
        overflowY: "auto",
        paddingBottom: "150px",
      }}
    >
      <div className="text-center mb-3">
        <h5 className="fw-bold text-primary">관리자 페이지</h5>
        <p className="text-muted small">ERP 시스템 관리 패널</p>
      </div>

      {/* 상단 탭 */}
      <Nav
        variant="tabs"
        className="justify-content-around mb-3 bg-white shadow-sm rounded-3 px-1"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="dashboard">📊 대시보드</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="employee">👥 직원 관리</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="approval">✅ 승인 관리</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* === 📊 대시보드 === */}
      {activeTab === "dashboard" && (
        <>
          <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
            <h6 className="fw-bold mb-3">📈 활동도</h6>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#007bff" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
            <h6 className="fw-bold mb-3">🏖️ 연차 사용도</h6>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={leaveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#28a745" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-3 shadow-sm mb-3 rounded-4 mx-2">
            <h6 className="fw-bold mb-3">💰 지출도</h6>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ffc107" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="text-center my-4">
            <Button variant="primary" onClick={() => setActiveTab("employee")}>
              👥 관리자 페이지로 이동
            </Button>
          </div>
        </>
      )}

      {/* === 👥 직원 관리 === */}
      {activeTab === "employee" && (
        <>
          <Card
            className="p-3 shadow-sm border-0 rounded-4 mx-2 mb-3"
            style={{ maxHeight: "350px", overflowY: "auto" }}
          >
            <h6 className="fw-bold mb-3">직원 목록</h6>
            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" />
              </div>
            ) : employees.length === 0 ? (
              <p className="text-center text-muted small">
                등록된 직원이 없습니다.
              </p>
            ) : (
              <Row xs={1} className="g-2">
                {employees.map((emp) => (
                  <Col key={emp.user_id}>
                    <Card className="p-2 shadow-sm rounded-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold text-dark">
                            {emp.user_name}{" "}
                            <Badge
                              bg={
                                emp.user_auth === "관리자"
                                  ? "warning"
                                  : "secondary"
                              }
                              text={
                                emp.user_auth === "관리자" ? "dark" : "light"
                              }
                              style={{ fontSize: "0.7rem" }}
                            >
                              {emp.user_auth}
                            </Badge>
                          </div>
                          <div
                            className="text-muted small"
                            style={{
                              fontSize: "0.7rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px",
                            }}
                          >
                            {emp.user_email}
                          </div>
                          <div className="text-muted small">
                            입사일: {emp.join_date} | 부서: {emp.dept_id}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={
                            emp.user_auth === "관리자"
                              ? "outline-warning"
                              : "outline-secondary"
                          }
                          style={{ fontSize: "0.7rem", padding: "3px 6px" }}
                          onClick={() =>
                            handleToggleRole(emp.user_id, emp.user_auth)
                          }
                        >
                          변경
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>

          {/* 직원 추가 */}
          <Card className="p-3 shadow-sm border-0 rounded-4 mx-2 mb-5">
            <h6 className="fw-bold mb-3">직원 추가</h6>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label className="small">이름</Form.Label>
                <Form.Control
                  value={newEmp.user_name}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, user_name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">이메일</Form.Label>
                <Form.Control
                  type="email"
                  value={newEmp.user_email}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, user_email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  value={newEmp.user_password}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, user_password: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">생년월일</Form.Label>
                <Form.Control
                  type="date"
                  value={newEmp.birthday}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, birthday: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">입사일</Form.Label>
                <Form.Control
                  type="date"
                  value={newEmp.join_date}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, join_date: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">부서</Form.Label>
                <Form.Select
                  value={newEmp.dept_id}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, dept_id: e.target.value })
                  }
                >
                  <option value="">부서를 선택하세요</option>
                  <option value="1">개발 1팀</option>
                  <option value="2">개발 2팀</option>
                  <option value="3">디자인팀</option>
                  <option value="4">기획팀</option>
                  <option value="5">전략기획</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small">권한</Form.Label>
                <Form.Select
                  value={newEmp.user_auth}
                  onChange={(e) =>
                    setNewEmp({ ...newEmp, user_auth: e.target.value })
                  }
                >
                  <option value="직원">직원</option>
                  <option value="관리자">관리자</option>
                </Form.Select>
              </Form.Group>
              <Button className="w-100" onClick={handleRegister}>
                직원 추가
              </Button>
            </Form>
          </Card>
        </>
      )}

        {/* === ✅ 승인 관리 === */}
     {/* === ✅ 승인 관리 === */}
      {activeTab === "approval" && (
        <Card className="p-3 shadow-sm border-0 rounded-4 mx-2 mb-5">
          <h6 className="fw-bold mb-3">출퇴근 승인 관리</h6>
          {approvals.length === 0 ? (
            <p className="text-center text-muted small my-3">
              승인 대기 내역이 없습니다.
            </p>
          ) : (
            approvals.map((item) => (
              <Card key={item.id} className="p-2 mb-2 shadow-sm rounded-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold text-dark">{item.user_name}</div>
                    <div className="text-muted small">
                      {item.date} | 상태:{" "}
                      <Badge
                        bg={
                          item.status === "승인"
                            ? "success"
                            : item.status === "지각"
                            ? "warning"
                            : item.status === "거절"
                            ? "danger"
                            : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleAttendApproval(item.id, "approve")}
                    >
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleAttendApproval(item.id, "late")}
                    >
                      지각
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleAttendApproval(item.id, "reject")}
                    >
                      거절
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </Card>
      )}
    </Container>
  );
}

export default AdminDashboard;
