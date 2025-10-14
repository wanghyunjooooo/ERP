// src/Login.js
import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ 실제 로그인 API 연동 자리는 여기에
    // fetch("/api/login", { method: "POST", body: JSON.stringify({ email, password }) })

    if (email && password) {
      alert("로그인 성공!");
      onLoginSuccess(); // App.js에서 Home 화면으로 전환
    } else {
      alert("이메일과 비밀번호를 입력하세요.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
      }}
    >
      <Card
        className="shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "380px",
          borderRadius: "25px",
          background: "white",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="logo"
            style={{ width: "70px", height: "70px" }}
          />
          <h3 className="fw-bold mt-3">Welcome Back 👋</h3>
          <p className="text-muted">로그인하여 계속 진행하세요</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력하세요"
              className="rounded-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="rounded-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  );
}

export default Login;
