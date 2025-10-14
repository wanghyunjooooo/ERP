import React, { useState } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { BsCashStack, BsCalendarDate, BsReceipt } from "react-icons/bs";
import BottomNav from "../components/Nav";
import Header from "../components/Header";

function ExpensePage({ onMenuSelect }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !date || !reason) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
    alert("✅ 지출 신청이 완료되었습니다!");
    setAmount("");
    setDate("");
    setReason("");
    setReceipt(null);
  };

  return (
      <>
      <Header />
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        paddingTop: "20px",
        paddingBottom: "calc(100px + env(safe-area-inset-bottom))", // ✅ 네비 + 안전영역
        boxSizing: "border-box",
      }}
    >
      <div
        className="d-flex flex-column align-items-center"
        style={{
          maxWidth: "430px",
          margin: "0 auto",
        }}
      >
        <Card
          className="shadow-sm border-0"
          style={{
            width: "92%",
            borderRadius: "20px",
            background: "#ffffff",
            marginBottom: "1.5rem", // ✅ 카드 간 여백만 유지
          }}
        >
          <Card.Body>
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <BsCashStack className="me-2 text-primary" /> 지출 신청
            </h5>

            <Form onSubmit={handleSubmit}>
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
                      cursor: "pointer",
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

              <Button
                type="submit"
                className="w-100 py-2 fw-semibold rounded-3"
                style={{
                  backgroundColor: "#4e73df",
                  border: "none",
                }}
              >
                지출 신청 완료
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* ✅ 하단 고정 네비게이션 */}
      <BottomNav onMenuSelect={onMenuSelect} />
    </div>
     </>
  );
}

export default ExpensePage;
