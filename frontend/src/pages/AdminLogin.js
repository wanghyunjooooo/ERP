import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { BsShieldLock } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id === "admin" && password === "1234") {
      alert("✅ 관리자 로그인 성공!");
      navigate("/admin/dashboard");
    } else {
      alert("❌ 관리자 계정이 올바르지 않습니다.");
    }
  };

  return (
     <>
      <Header/>
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        maxWidth: "430px",
      }}
    >
      <Card
        className="shadow-lg p-4 border-0"
        style={{
          width: "100%",
          borderRadius: "25px",
          background: "white",
        }}
      >
        <div className="text-center mb-4">
          <BsShieldLock size={60} color="#4e73df" />
          <h4 className="fw-bold mt-3">관리자 로그인</h4>
          <p className="text-muted small">Admin access only</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>아이디</Form.Label>
            <Form.Control
              type="text"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-3 py-2"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 rounded-3 py-2 fw-semibold"
            style={{
              backgroundColor: "#4e73df",
              border: "none",
              fontSize: "1.05rem",
            }}
          >
            로그인
          </Button>
        </Form>
      </Card>
    </Container>
       </>
  );
}

export default AdminLogin;
