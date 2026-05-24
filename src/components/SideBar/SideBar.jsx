import React, { useState } from "react";

const GRAD = "linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)";

const navItems = [
  { icon: "🏠", label: "Home" },
  { icon: "👥", label: "Friends" },
  { icon: "🫂", label: "Groups" },
  { icon: "🛒", label: "Marketplace" },
  { icon: "🔖", label: "Saved" },
  { icon: "🚩", label: "Pages" },
  { icon: "⭐", label: "Favorites" },
];

const groups = [
  { id: 1, name: "Art & Design", avatar: "https://i.pravatar.cc/150?u=grp1" },
  { id: 2, name: "Fitness Squad", avatar: "https://i.pravatar.cc/150?u=grp2" },
  { id: 3, name: "Travel Lovers", avatar: "https://i.pravatar.cc/150?u=grp3" },
  { id: 4, name: "Tech & Gadgets", avatar: "https://i.pravatar.cc/150?u=grp4" },
];

export default function SideBar() {
  const [active, setActive] = useState("Home");

  return (
    /* ── Outer sticky wrapper ── */
    <div
      style={{
        fontFamily: "'Nunito', 'Poppins', sans-serif",
        position: "sticky",
        top: 80,
      }}
    >
      {/* ── White card container ── */}
      <div
        style={{
          width: "100%",
          minWidth: 260,
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #FFE4EC",
          boxShadow: "0 6px 32px rgba(255,51,102,0.09)",
          padding: "18px 14px 20px",
          overflow: "hidden",
        }}
      >
        {/* Brand strip at the top */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px 16px",
            borderBottom: "1.5px solid #FFE4EC",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: GRAD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(255,51,102,0.3)",
            }}
          >
            💬
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 17,
              background: GRAD,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.3px",
            }}
          >
            SocialApp
          </span>
        </div>

        {/* Nav items */}
        <nav>
          {navItems.map(({ icon, label }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: 12,
                  background: isActive ? "#FFF0F3" : "transparent",
                  border: isActive
                    ? "1.5px solid #FFAEC9"
                    : "1.5px solid transparent",
                  cursor: "pointer",
                  marginBottom: 3,
                  transition: "background .15s, border-color .15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#FFF7F9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon bubble */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: isActive ? GRAD : "#FFE4EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    flexShrink: 0,
                    boxShadow: isActive
                      ? "0 4px 12px rgba(255,51,102,0.3)"
                      : "none",
                    transition: "all .2s",
                  }}
                >
                  {icon}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "#FF3366" : "#3D1A28",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: GRAD,
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #FFAEC9, transparent)",
            margin: "16px 4px",
          }}
        />

        {/* My Groups */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#C084A0",
              marginBottom: 10,
              marginLeft: 6,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            My Groups
          </p>
          {groups.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 10px",
                borderRadius: 12,
                cursor: "pointer",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#FFF7F9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <img
                src={g.avatar}
                alt={g.name}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  objectFit: "cover",
                  border: "2px solid #FFAEC9",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#3D1A28" }}>
                {g.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
