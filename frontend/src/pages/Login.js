import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          user_password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("로그인 성공!");

        // ✅ 토큰과 사용자 정보 저장
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

    
          navigate("/home");
        
      } else {
        alert(data.error || "로그인 실패");
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{
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

          <Form.Group className="mb-4" controlId="formBasicPassword">
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
    </div>
  );
}

export default Login;
