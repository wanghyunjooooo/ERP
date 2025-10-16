import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import {
  BsHouseDoor,
  BsUmbrella,
  BsCashStack,
  BsBarChart,
  BsLockFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function BottomNav({ onMenuSelect }) {
  const [active, setActive] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.user_auth === "관리자");
    }
  }, []);

  const handleSelect = (menu) => {
    setActive(menu);
    if (typeof onMenuSelect === "function") {
      onMenuSelect(menu);
    }

    // ✅ /home으로 이동
    if (menu === "home") navigate("/home");
  };

  const activeColor = "#007bff";
  const inactiveColor = "#6c757d";

  const navItems = [
    { key: "home", icon: <BsHouseDoor size={22} />, label: "홈" }, // ✅ 변경됨
    { key: "vacation", icon: <BsUmbrella size={22} />, label: "연차신청" },
    { key: "expense", icon: <BsCashStack size={22} />, label: "지출신청" },
    { key: "expenseList", icon: <BsBarChart size={22} />, label: "지출조회" },
    ...(isAdmin
      ? [{ key: "admin", icon: <BsLockFill size={22} />, label: "관리자" }]
      : []),
  ];

  return (
    <Navbar
      fixed="bottom"
      bg="white"
      className="shadow-lg border-top justify-content-around py-2"
      style={{
        height: "80px",
        paddingBottom: "env(safe-area-inset-bottom)",
        borderRadius: "20px 20px 0 0",
        backdropFilter: "blur(8px)",
      }}
    >
      <Nav
        className="d-flex justify-content-between align-items-center w-100 px-3"
        style={{ maxWidth: "430px", margin: "0 auto" }}
      >
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant="link"
            className="text-center fw-semibold d-flex flex-column align-items-center"
            style={{
              flex: 1,
              color: active === item.key ? activeColor : inactiveColor,
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
              textDecoration: "none",
              padding: "6px 0",
            }}
            onClick={() => handleSelect(item.key)}
          >
            {item.icon}
            <span
              style={{
                marginTop: "3px",
                fontWeight: active === item.key ? "600" : "500",
              }}
            >
              {item.label}
            </span>
            {active === item.key && (
              <div
                style={{
                  width: "24px",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: activeColor,
                  marginTop: "4px",
                }}
              />
            )}
          </Button>
        ))}
      </Nav>
    </Navbar>
  );
}

export default BottomNav;
