import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Input,
  Badge,
} from "@nextui-org/react";
import imgLogo from "../../assets/auth/logo1.png";
import { LuMessageSquareHeart } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <Navbar
      maxWidth="2xl"
      height="72px"
      style={{
        background: "#fff",
        borderBottom: "1.5px solid #FFAEC9",
        boxShadow: "0 4px 24px rgba(255,51,102,0.08)",
        fontFamily: "'Nunito', 'Poppins', 'Segoe UI', sans-serif",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      {/* ── Brand ── */}
      <NavbarBrand>
        <img src={imgLogo} alt="Logo" width="38" className="rounded-2xl" />
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            paddingLeft: 8,
            background: "linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.3px",
          }}
        >
          SocialApp
        </span>
      </NavbarBrand>

      {/* ── Search ── */}
      <NavbarBrand className="max-w-md w-full px-6">
        <Input
          radius="full"
          fullWidth
          placeholder="Search people, posts…"
          startContent={
            <span style={{ color: "#FFAEC9", fontSize: 15 }}>🔍</span>
          }
          classNames={{
            inputWrapper: [
              "border-[1.5px]",
              "border-[#FFAEC9]",
              "bg-[#FFF7F9]",
              "hover:border-[#FF6B9D]",
              "focus-within:border-[#FF3366]",
              "focus-within:ring-2",
              "focus-within:ring-[#FF336622]",
              "transition-all",
            ],
            input: ["text-[#3D1A28]", "placeholder:text-[#C084A0]", "text-sm"],
          }}
        />
      </NavbarBrand>

      {/* ── Right side ── */}
      <NavbarContent as="div" justify="end">
        {/* Icon buttons */}
        <NavbarItem className="flex items-center gap-6">
          {/* Messages */}
          <button
            style={{
              background: "#FFF0F3",
              border: "1.5px solid #FFAEC9",
              borderRadius: 12,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              transition: "border-color .2s, box-shadow .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF3366";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(255,51,102,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#FFAEC9";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Badge
              color="danger"
              content="5"
              size="sm"
              style={{ background: "linear-gradient(135deg,#FF3366,#FF6B9D)" }}
            >
              <LuMessageSquareHeart
                style={{ fontSize: 20, color: "#FF3366" }}
              />
            </Badge>
          </button>

          {/* Notifications */}
          <button
            style={{
              background: "#FFF0F3",
              border: "1.5px solid #FFAEC9",
              borderRadius: 12,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color .2s, box-shadow .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF3366";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(255,51,102,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#FFAEC9";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Badge color="danger" content="3" size="sm">
              <IoMdNotificationsOutline
                style={{ fontSize: 20, color: "#FF3366" }}
              />
            </Badge>
          </button>
        </NavbarItem>

        {/* Avatar dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform ml-2"
              size="md"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              style={{
                border: "2px solid #FF6B9D",
                boxShadow: "0 0 0 3px rgba(255,107,157,0.2)",
              }}
            />
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            style={{
              borderRadius: 16,
              border: "1.5px solid #FFAEC9",
              boxShadow: "0 8px 30px rgba(255,51,102,0.12)",
              overflow: "hidden",
            }}
          >
            <DropdownItem
              key="profile"
              className="h-14 gap-1"
              style={{ borderBottom: "1px solid #FFE4EC" }}
            >
              <p style={{ fontSize: 11, color: "#C084A0", fontWeight: 600 }}>
                Signed in as
              </p>
              <p style={{ fontSize: 13, color: "#2D0A1A", fontWeight: 800 }}>
                zoey@example.com
              </p>
            </DropdownItem>

            <DropdownItem
              key="MyProfile"
              style={{ color: "#3D1A28", fontWeight: 600, fontSize: 14 }}
            >
              👤 My Profile
            </DropdownItem>

            <DropdownItem
              key="logout"
              style={{
                color: "#FF3366",
                fontWeight: 700,
                fontSize: 14,
                borderTop: "1px solid #FFE4EC",
              }}
              onClick={() => handleLogout()}
            >
              🚪 Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
