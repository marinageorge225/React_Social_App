import React, { useContext, useState } from "react";
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
} from "@nextui-org/react";
import imgLogo from "../../assets/auth/logo1.png";
import { LuMessageSquareHeart } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const PINK = "#e91e8c";
const PINK_SOFT = "#fdf0f6";
const PINK_BORDER = "#f5c6dd";
const PINK_MID = "#e991b8";
const PINK_TEXT = "#5a1a35";

/* ── Round icon button ─────────────────────────────────────────────────────── */
function ActionBtn({ children, badge, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        background: hovered ? "#fce4f1" : PINK_SOFT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background .16s",
        color: hovered ? PINK : "#c2185b",
        fontSize: 20,
      }}
    >
      {React.cloneElement(children, {
        style: { fontSize: 20, color: "inherit" },
      })}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 1,
            right: 1,
            minWidth: 17,
            height: 17,
            padding: "0 4px",
            background: PINK,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #fff",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <div>
      {/* Solid top accent */}
      <div style={{ height: 2, background: PINK }} />

      <Navbar
        maxWidth="2xl"
        height="60px"
        style={{
          background: "#fff",
          borderBottom: `1px solid ${PINK_BORDER}`,
          fontFamily: "-apple-system, 'Segoe UI', sans-serif",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
        }}
      >
        {/* Brand */}
        <NavbarBrand style={{ gap: 9, minWidth: 160 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: PINK,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={imgLogo}
                alt="Logo"
                width="20"
                style={{ borderRadius: 5 }}
              />
            </div>
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#c2185b",
                letterSpacing: "-0.3px",
              }}
            >
              SocialApp
            </div>
            <div
              style={{
                fontSize: 9,
                color: PINK_MID,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Connect · Share · Discover
            </div>
          </div>
        </NavbarBrand>

        {/* Search — Facebook-style pink focus */}
        <NavbarBrand className="w-full max-w-sm mx-auto">
          <Input
            radius="full"
            fullWidth
            placeholder="Search people, posts, groups…"
            startContent={
              <span style={{ fontSize: 15, color: PINK_MID }}>🔍</span>
            }
            classNames={{
              inputWrapper: [
                "bg-[#fdf0f6]",
                "border-[1.5px]",
                "border-[#f5c6dd]",
                "hover:border-[#e991b8]",
                "hover:bg-white",
                "data-[focus=true]:bg-white",
                "data-[focus=true]:border-[#e91e8c]",
                "data-[focus=true]:shadow-[0_0_0_3px_rgba(233,30,140,0.10)]",
                "transition-all",
                "duration-200",
                "h-[40px]",
              ],
              input: [
                "text-[#5a1a35]",
                "placeholder:text-[#d4a0bc]",
                "text-sm",
                "font-medium",
              ],
            }}
          />
        </NavbarBrand>

        {/* Right */}
        <NavbarContent as="div" justify="end">
          <NavbarItem>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ActionBtn badge="5" label="Messages">
                <LuMessageSquareHeart />
              </ActionBtn>

              <ActionBtn badge="3" label="Notifications">
                <IoMdNotificationsOutline />
              </ActionBtn>

              <div
                style={{
                  width: 1,
                  height: 30,
                  background: PINK_BORDER,
                  margin: "0 4px",
                }}
              />

              {/* Avatar dropdown */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 12px 5px 5px",
                      borderRadius: 999,
                      border: `1.5px solid ${PINK_BORDER}`,
                      background: PINK_SOFT,
                      cursor: "pointer",
                      transition: "all .16s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = PINK_MID;
                      e.currentTarget.style.background = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = PINK_BORDER;
                      e.currentTarget.style.background = PINK_SOFT;
                    }}
                  >
                    <Avatar
                      size="sm"
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      style={{
                        width: 30,
                        height: 30,
                        border: `2px solid ${PINK_MID}`,
                      }}
                    />
                    <div style={{ lineHeight: 1.25 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: PINK_TEXT,
                        }}
                      >
                        Jason H.
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: PINK_MID,
                          fontWeight: 500,
                        }}
                      >
                        View profile
                      </div>
                    </div>
                    <IoChevronDownOutline
                      style={{ fontSize: 13, color: PINK_MID, marginLeft: 2 }}
                    />
                  </div>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${PINK_BORDER}`,
                    boxShadow: "0 8px 30px rgba(194,24,91,0.12)",
                    overflow: "hidden",
                    minWidth: 230,
                    padding: 0,
                  }}
                >
                  <DropdownItem
                    key="profile-info"
                    isReadOnly
                    style={{
                      padding: "14px",
                      borderBottom: `1px solid ${PINK_BORDER}`,
                      background: PINK_SOFT,
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar
                        size="sm"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        style={{ border: `2px solid ${PINK_MID}` }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: PINK_TEXT,
                          }}
                        >
                          Jason Hughes
                        </div>
                        <div style={{ fontSize: 11, color: "#c291aa" }}>
                          zoey@example.com
                        </div>
                      </div>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="MyProfile"
                    style={{
                      padding: "11px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: PINK_TEXT,
                    }}
                  >
                    👤 My Profile
                  </DropdownItem>

                  <DropdownItem
                    key="settings"
                    style={{
                      padding: "11px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: PINK_TEXT,
                    }}
                  >
                    ⚙️ Settings
                  </DropdownItem>

                  <DropdownItem
                    key="logout"
                    onClick={handleLogout}
                    style={{
                      padding: "11px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: PINK,
                      borderTop: `1px solid ${PINK_BORDER}`,
                    }}
                  >
                    🚪 Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
