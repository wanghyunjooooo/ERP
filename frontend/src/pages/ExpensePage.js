import React, { useState, useEffect } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { BsCashStack, BsCalendarDate, BsReceipt, BsBuilding } from "react-icons/bs";
import axios from "axios";
import BottomNav from "../components/Nav";
import Header from "../components/Header";

function ExpensePage({ onMenuSelect }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [category, setCategory] = useState("");
  const [deptId, setDeptId] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 모든 항목 (영수증 포함) 입력 여부 체크
    if (!amount || !date || !reason || !category || !deptId || !receipt) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다!");
      return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("category", category);
    formData.append("description", reason);
    formData.append("dept_id", deptId);
    formData.append("receipt", receipt);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/expense", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ 지출 신청 성공:", res.data);
      alert("✅ 지출 신청이 완료되었습니다!");

      // 입력 초기화
      setAmount("");
      setDate("");
      setReason("");
      setCategory("");
      setDeptId("");
      setReceipt(null);
    } catch (error) {
      console.error("❌ 지출 신청 실패:", error);

      if (error.response?.status === 401) {
        alert("인증 오류: 로그인 토큰이 유효하지 않습니다. 다시 로그인해주세요.");
      } else {
        alert("지출 신청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          paddingTop: "20px",
          paddingBottom: "calc(100px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="d-flex flex-column align-items-center"
          style={{ maxWidth: "430px", margin: "0 auto" }}
        >
          <Card
            className="shadow-sm border-0"
            style={{
              width: "92%",
              borderRadius: "20px",
              background: "#ffffff",
              marginBottom: "1.5rem",
            }}
          >
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <BsCashStack className="me-2 text-primary" /> 지출 신청
              </h5>

              <Form onSubmit={handleSubmit}>
                {/* 금액 */}
                <Form.Group className="mb-3">
                  <Form.Label>금액</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="금액을 입력하세요"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <InputGroup.Text>원</InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {/* 날짜 */}
                <Form.Group className="mb-3">
                  <Form.Label>날짜</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsCalendarDate />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* 카테고리 */}
                <Form.Group className="mb-3">
                  <Form.Label>카테고리</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="식비">식비</option>
                    <option value="교통비">교통비</option>
                    <option value="숙박비">숙박비</option>
                    <option value="기타">기타</option>
                  </Form.Select>
                </Form.Group>

                {/* 부서 */}
                <Form.Group className="mb-3">
                  <Form.Label>부서</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsBuilding />
                    </InputGroup.Text>
                    <Form.Select
                      value={deptId}
                      onChange={(e) => setDeptId(e.target.value)}
                    >
                      <option value="">부서를 선택하세요</option>
                      <option value="1">개발 1</option>
                      <option value="2">개발 2</option>
                      <option value="3">개발 3</option>
                      <option value="4">웹업</option>
                      <option value="5">전략기획</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>

                {/* 영수증 */}
                <Form.Group className="mb-3">
                  <Form.Label>영수증 업로드</Form.Label>
                  <div
                    className="p-3 border rounded text-center"
                    style={{
                      borderStyle: "dashed",
                      borderColor: "#ced4da",
                      borderRadius: "12px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceipt(e.target.files[0])}
                      style={{
                        opacity: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      id="receiptUpload"
                    />
                    <label htmlFor="receiptUpload" className="d-block">
                      <BsReceipt className="text-secondary mb-2" size={26} />
                      <div className="small text-secondary">
                        {receipt ? receipt.name : "영수증 이미지를 선택하세요"}
                      </div>
                    </label>
                  </div>
                </Form.Group>

                {/* 사유 */}
                <Form.Group className="mb-3">
                  <Form.Label>지출 사유</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="지출 사유를 입력하세요"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Form.Group>

                {/* 제출 버튼 */}
                <Button
                  type="submit"
                  className="w-100 py-2 fw-semibold rounded-3"
                  style={{ backgroundColor: "#4e73df", border: "none" }}
                  disabled={loading}
                >
                  {loading ? "처리 중..." : "지출 신청 완료"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <BottomNav onMenuSelect={onMenuSelect} />
      </div>
    </>
  );
}

export default ExpensePage;
