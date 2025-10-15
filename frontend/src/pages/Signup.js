import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "linear-gradient(135deg, #74ABE2, #5563DE)";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.background = "";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: formData.name,
          user_email: formData.email,
          user_password: formData.password,
          user_auth: "user", // 기본 권한
          birthday: "2000-01-01", // 기본값 (필요시 date picker 추가)
          join_date: new Date().toISOString().split("T")[0], // 오늘 날짜
          dept_id: 1, // 기본 부서 ID (테스트용)
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        alert(data.error || "회원가입 실패");
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
      }}
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{ maxWidth: "380px", borderRadius: "25px", background: "white" }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
            alt="signup"
            style={{ width: "70px", height: "70px" }}
          />
          <h3 className="fw-bold mt-3">Create Account ✨</h3>
          <p className="text-muted">새로운 계정을 만들어주세요</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>이름</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              className="rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              className="rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              className="rounded-3 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type="password"
              name="confirm"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirm}
              onChange={handleChange}
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
            회원가입
          </Button>
        </Form>

        <div className="text-center mt-4">
          <p className="text-muted mb-1">이미 계정이 있으신가요?</p>
          <Button
            variant="link"
            className="p-0 fw-semibold"
            style={{ color: "#4e73df", textDecoration: "none" }}
            onClick={() => navigate("/login")}
          >
            로그인하기
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SignUp;
