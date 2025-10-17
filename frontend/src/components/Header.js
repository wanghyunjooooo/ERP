// src/components/Header.js
import React from "react";
import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsHouseDoorFill } from "react-icons/bs";

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <Navbar
      bg="white"
      className="shadow-sm px-3 position-relative"
      fixed="top"
      style={{
        height: "60px",
        borderBottom: "1px solid #e5e5e5",
        zIndex: 1050,
      }}
    >
      {/* 중앙 ERP 로고 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span className="fw-bold" style={{ color: "#4e73df", fontSize: "1.1rem" }}>
          ERP
        </span>
        {title && (
          <h6 className="m-0 text-dark fw-semibold" style={{ fontSize: "1rem" }}>
            {title}
          </h6>
        )}
      </div>

      {/* 오른쪽 홈 버튼 */}
      <div
        onClick={() => navigate("/home")}
        style={{
          marginLeft: "auto",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <BsHouseDoorFill size={22} color="#4e73df" />
      </div>
    </Navbar>
  );
}

export default Header;
