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
      className="shadow-sm px-3 justify-content-between"
      fixed="top"
      style={{
        height: "60px",
        borderBottom: "1px solid #e5e5e5",
        zIndex: 1050,
      }}
    >
      <div
        onClick={() => navigate("/home")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <BsHouseDoorFill size={22} color="#4e73df" />
        <span className="fw-bold" style={{ color: "#4e73df" }}>
          ERP
        </span>
      </div>

      <h6
        className="m-0 text-dark fw-semibold"
        style={{ fontSize: "1rem", textAlign: "center" }}
      >
        {title}
      </h6>

      <div style={{ width: "32px" }}></div> {/* 오른쪽 여백 맞춤용 */}
    </Navbar>
  );
}

export default Header;
