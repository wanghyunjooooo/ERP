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

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("employee");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        alert("관리자 권한이 없습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (res.ok) setEmployees(data);
      else alert(data.error || "직원 조회 실패");
    } catch (err) {
      alert("서버 연결 실패");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ 직원 추가 (403 자동 처리 포함)
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

      // ✅ 403이면 자동 로그아웃
      if (res.status === 403) {
        alert("관리자 권한이 없습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

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
        fetchEmployees(); // 목록 갱신
      } else {
        alert(data.error || "직원 추가 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error(err);
    }
  };

  // ✅ 권한 토글
  const handleToggleRole = async (user_id, currentRole) => {
    const newRole = currentRole === "관리자" ? "직원" : "관리자";
    if (!window.confirm(`'${newRole}' 권한으로 변경할까요?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/users/${user_id}/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_auth: newRole }),
      });

      if (res.status === 403) {
        alert("관리자 권한이 없습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        alert("권한이 변경되었습니다.");
        fetchEmployees();
      } else alert(data.error || "권한 변경 실패");
    } catch (err) {
      alert("서버 오류 발생");
      console.error(err);
    }
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
        paddingBottom: "150px",
      }}
    >
      {/* 상단 */}
      <div className="text-center mb-3">
        <h5 className="fw-bold text-primary">관리자 대시보드</h5>
        <p className="text-muted small">ERP 시스템 관리 패널</p>
      </div>

      {/* 탭 */}
      <Nav
        variant="tabs"
        className="justify-content-around mb-3 bg-white shadow-sm rounded-3 px-1"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="employee">👥 직원 관리</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* === 직원 목록 === */}
      {activeTab === "employee" && (
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
                  <Card
                    className="p-2 shadow-sm rounded-3"
                    style={{ fontSize: "0.8rem" }}
                  >
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
                            text={emp.user_auth === "관리자" ? "dark" : "light"}
                            style={{ fontSize: "0.7rem" }}
                          >
                            {emp.user_auth}
                          </Badge>
                        </div>
                        <div
                          className="text-muted"
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
                        <div
                          className="text-muted small"
                          style={{ fontSize: "0.7rem" }}
                        >
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
      )}

      {/* === 직원 추가 === */}
      {activeTab === "employee" && (
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
      )}
    </Container>
  );
}

export default AdminDashboard;
