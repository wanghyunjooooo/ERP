// src/pages/AdminDashboard.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Badge,
  Nav,
} from "react-bootstrap";
import {
  BsBarChart,
  BsPeopleFill,
  BsUmbrellaFill,
  BsCashStack,
} from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const activityData = [
  { day: "월", 활동도: 40, 연차: 10, 지출: 20 },
  { day: "화", 활동도: 60, 연차: 15, 지출: 25 },
  { day: "수", 활동도: 55, 연차: 10, 지출: 30 },
  { day: "목", 활동도: 70, 연차: 20, 지출: 35 },
  { day: "금", 활동도: 80, 연차: 5, 지출: 40 },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // 직원 관리용 상태
  const [employees, setEmployees] = useState([
    {
      id: 1,
      userId: "hong123",
      name: "홍길동",
      dept: "인사",
      role: "직원",
      email: "hong@test.com",
      birth: "1990-05-12",
      joinDate: "2024-01-10",
      active: true,
    },
    {
      id: 2,
      userId: "kimcs",
      name: "김철수",
      dept: "개발",
      role: "관리자",
      email: "kim@test.com",
      birth: "1988-08-30",
      joinDate: "2023-05-12",
      active: false,
    },
  ]);

  const [newEmp, setNewEmp] = useState({
    userId: "",
    password: "",
    name: "",
    birth: "",
    email: "",
    dept: "",
    role: "직원",
    joinDate: "",
  });

  const [requests, setRequests] = useState([
    { id: 1, type: "근태", name: "홍길동", status: "대기" },
    { id: 2, type: "연차", name: "김철수", status: "대기" },
    { id: 3, type: "지출", name: "이영희", status: "대기" },
  ]);

  // 직원 권한 토글
  const handleToggleRole = (id) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? { ...emp, role: emp.role === "직원" ? "관리자" : "직원" }
          : emp
      )
    );
  };

  // 직원 등록
  const handleRegister = () => {
    const { userId, password, name, email, dept, birth, joinDate } = newEmp;

    if (!userId || !password || !name || !email || !dept || !birth || !joinDate) {
      alert("모든 항목(아이디, 비밀번호, 이름, 생년월일, 이메일, 부서, 입사일)을 입력해주세요!");
      return;
    }

    const newEntry = {
      id: employees.length + 1,
      ...newEmp,
      active: false,
    };
    setEmployees([...employees, newEntry]);
    alert("직원 등록 완료!");
    setNewEmp({
      userId: "",
      password: "",
      name: "",
      birth: "",
      email: "",
      dept: "",
      role: "직원",
      joinDate: "",
    });
    // 등록 후 확실히 보이도록 직원 관리 탭에 여유공간 확보 (컨테이너에 패딩 이미 있음)
  };

  // 승인/거절 처리
  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: action === "approve" ? "승인" : "거절" }
          : req
      )
    );
  };

  return (
    <Container
      fluid
      className="py-3"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        maxWidth: "430px",
        overflowY: "auto",
        // **고정 하단 네비 높이(예: 80px) + 안전영역(약 34px) 대비 여유 확보**
        // 충분히 크게 잡아야 버튼이 가려지지 않습니다.
        paddingBottom: "calc(140px + env(safe-area-inset-bottom))",
      }}
    >
      <div className="text-center mb-3">
        <h4 className="fw-bold text-primary mb-1">관리자 대시보드</h4>
        <p className="text-muted small">ERP 시스템 관리 패널</p>
      </div>

      {/* 상단 탭 (sticky) */}
      <Nav
        variant="tabs"
        className="justify-content-around mb-3 bg-white shadow-sm rounded-3 px-1"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
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

      {/* === 대시보드 === */}
      {activeTab === "dashboard" && (
        <>
          <Row className="g-3 px-2">
            <Col xs={6}>
              <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
                <BsPeopleFill size={24} className="text-primary mb-2" />
                <h6 className="fw-semibold mb-0">활동도</h6>
                <small className="text-muted">+12% 상승</small>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
                <BsUmbrellaFill size={24} className="text-info mb-2" />
                <h6 className="fw-semibold mb-0">연차 사용</h6>
                <small className="text-muted">5건 처리</small>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
                <BsCashStack size={24} className="text-success mb-2" />
                <h6 className="fw-semibold mb-0">지출 현황</h6>
                <small className="text-muted">3,200,000원</small>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="shadow-sm border-0 rounded-4 p-3 text-center">
                <BsBarChart size={24} className="text-warning mb-2" />
                <h6 className="fw-semibold mb-0">통계 요약</h6>
                <small className="text-muted">실시간 업데이트</small>
              </Card>
            </Col>
          </Row>

          <Card
            className="shadow-sm border-0 rounded-4 mt-4 mx-2"
            style={{ background: "white" }}
          >
            <Card.Body>
              <h6 className="fw-bold mb-3">전체 요약 그래프</h6>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="활동도"
                    stroke="#4e73df"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="연차" stroke="#36b9cc" strokeWidth={2} />
                  <Line type="monotone" dataKey="지출" stroke="#1cc88a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </>
      )}
{/* === 직원 관리 === */}
{activeTab === "employee" && (
  <div>
    <Card className="p-3 shadow-sm border-0 rounded-4 mx-2 mb-3">
      <h6 className="fw-bold mb-3">직원 목록</h6>

      {/* 스크롤 제거, 폰트 축소 */}
      <Table bordered hover style={{ fontSize: "0.85rem" }}>
        <thead className="table-light text-center align-middle">
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>부서</th>
            <th>권한</th>
            <th>입사일</th>
            <th>로그인</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.userId}</td>
              <td>
                <div className="fw-semibold">{emp.name}</div>
                <small className="text-muted">{emp.email}</small>
              </td>
              <td>{emp.dept}</td>
              <td>
                <Button
                  variant={emp.role === "관리자" ? "warning" : "secondary"}
                  size="sm"
                  onClick={() => handleToggleRole(emp.id)}
                >
                  {emp.role}
                </Button>
              </td>
              <td>{emp.joinDate}</td>
              <td>
                <Badge bg={emp.active ? "success" : "secondary"}>
                  {emp.active ? "ON" : "OFF"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>

          {/* 직원 등록 카드 (폼) */}
          <Card
            className="p-3 shadow-sm border-0 rounded-4 mx-2 mb-4"
            style={{ overflow: "visible" }}
          >
            <h6 className="fw-bold mb-3">직원 등록 (모든 항목 입력)</h6>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label className="small">아이디</Form.Label>
                <Form.Control
                  placeholder="예) hong123 (로그인에 사용되는 아이디)"
                  value={newEmp.userId}
                  onChange={(e) => setNewEmp({ ...newEmp, userId: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="계정 비밀번호 입력"
                  value={newEmp.password}
                  onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">이름</Form.Label>
                <Form.Control
                  placeholder="실명 입력"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">생년월일</Form.Label>
                <Form.Control
                  type="date"
                  value={newEmp.birth}
                  onChange={(e) => setNewEmp({ ...newEmp, birth: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">이메일</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@company.com"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">부서</Form.Label>
                <Form.Control
                  placeholder="부서명 입력"
                  value={newEmp.dept}
                  onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small">권한</Form.Label>
                <Form.Select
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                >
                  <option value="직원">직원</option>
                  <option value="관리자">관리자</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small">입사일</Form.Label>
                <Form.Control
                  type="date"
                  value={newEmp.joinDate}
                  onChange={(e) => setNewEmp({ ...newEmp, joinDate: e.target.value })}
                />
              </Form.Group>

              <Button
                variant="primary"
                className="w-100"
                onClick={handleRegister}
              >
                직원 등록
              </Button>
            </Form>
          </Card>
        </div>
      )}

      {/* === 승인 관리 === */}
      {activeTab === "approval" && (
        <Card className="p-3 shadow-sm border-0 rounded-4 mx-2">
          <h6 className="fw-bold mb-3">요청 승인 관리</h6>
          <div className="table-responsive">
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>유형</th>
                  <th>이름</th>
                  <th>상태</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.type}</td>
                    <td>{r.name}</td>
                    <td>{r.status}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction(r.id, "approve")}
                      >
                        승인
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(r.id, "reject")}
                      >
                        거절
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* 안전 스페이서: 하단 고정 네비 때문에 가려지는 걸 방지 */}
      <div style={{ height: "120px" }} />
    </Container>
  );
}

export default AdminDashboard;
