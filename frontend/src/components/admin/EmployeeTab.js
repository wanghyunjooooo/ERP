import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  Badge,
  Container,
} from "react-bootstrap";

function EmployeeTab() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newEmp, setNewEmp] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    birthday: "",
    join_date: "",
    dept_id: "",
    user_auth: "일반",
  });

  // ✅ 직원 목록 불러오기
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("직원 목록 불러오기 실패");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("❌ 직원 목록 오류:", err);
      alert("직원 목록 불러오기 실패");
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
          user_auth: "일반",
        });
        fetchEmployees();
      } else {
        alert(data.error || "직원 추가 실패");
      }
    } catch (err) {
      alert("서버 오류 발생");
      console.error("❌ 직원 추가 오류:", err);
    }
  };

  // ✅ 권한 변경
  const handleAuthChange = async (user_id, currentAuth) => {
    const newAuth = currentAuth === "관리자" ? "일반" : "관리자";
    if (!window.confirm(`해당 사용자의 권한을 '${newAuth}'로 변경하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/users/${user_id}/auth`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_auth: newAuth }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "권한이 변경되었습니다.");
        fetchEmployees();
      } else {
        alert(data.error || "권한 변경 실패");
      }
    } catch (err) {
      console.error("❌ 권한 변경 오류:", err);
      alert("서버 오류 발생");
    }
  };

return (
  <div style={{ paddingBottom: "120px", minHeight: "100vh" }}>
    <Container className="p-0">
      <Card className="p-4 shadow-sm border-0 rounded-4 mb-4">
        <h5 className="fw-bold mb-3">👥 직원 관리</h5>

        {/* 직원 추가 폼 */}
        <Form className="mb-3 small-text">
          <Row className="g-2">
            <Col xs={6}>
              <Form.Control
                placeholder="이름"
                value={newEmp.user_name}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, user_name: e.target.value })
                }
              />
            </Col>
            <Col xs={6}>
              <Form.Control
                placeholder="이메일"
                value={newEmp.user_email}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, user_email: e.target.value })
                }
              />
            </Col>
            <Col xs={6}>
              <Form.Control
                placeholder="비밀번호"
                type="password"
                value={newEmp.user_password}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, user_password: e.target.value })
                }
              />
            </Col>
            <Col xs={6}>
              <Form.Control
                type="date"
                value={newEmp.birthday}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, birthday: e.target.value })
                }
              />
            </Col>
            <Col xs={6}>
              <Form.Control
                type="date"
                value={newEmp.join_date}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, join_date: e.target.value })
                }
              />
            </Col>
            <Col xs={6}>
              <Form.Select
                value={newEmp.dept_id}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, dept_id: e.target.value })
                }
              >
                <option value="">부서 선택</option>
                <option value="1">개발 1</option>
                <option value="2">개발 2</option>
                <option value="3">디자인</option>
                <option value="4">기획</option>
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Select
                value={newEmp.user_auth}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, user_auth: e.target.value })
                }
              >
                <option value="일반">일반</option>
                <option value="관리자">관리자</option>
              </Form.Select>
            </Col>
          </Row>
          <Button className="w-100 mt-3 py-2 fw-semibold" onClick={handleRegister}>
            직원 추가
          </Button>
        </Form>
      </Card>

      {/* 직원 목록 */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : employees.length === 0 ? (
        <p className="text-center text-muted py-3">등록된 직원이 없습니다.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {employees.map((emp) => (
            <Card
              key={emp.user_id}
              className="p-3 shadow-sm border-0 rounded-3"
              style={{ fontSize: "0.9rem" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">{emp.user_name}</h6>
                  <small className="text-muted">{emp.user_email}</small>
                </div>
                <Badge
                  bg={emp.user_auth === "관리자" ? "warning" : "secondary"}
                  text={emp.user_auth === "관리자" ? "dark" : "light"}
                  className="px-2 py-1"
                >
                  {emp.user_auth}
                </Badge>
              </div>

              <hr className="my-2" />

              <div className="text-muted small">
                <div>부서: {emp.dept_name}</div>
                <div>
                  입사일: {new Date(emp.join_date).toLocaleDateString("ko-KR")}
                </div>
                <div>
                  생일: {new Date(emp.birthday).toLocaleDateString("ko-KR")}
                </div>
              </div>

              <Button
                size="sm"
                variant={
                  emp.user_auth === "관리자"
                    ? "outline-secondary"
                    : "outline-warning"
                }
                className="mt-3 w-100"
                onClick={() => handleAuthChange(emp.user_id, emp.user_auth)}
              >
                권한 변경
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Container>
  </div>
);

}

export default EmployeeTab;
