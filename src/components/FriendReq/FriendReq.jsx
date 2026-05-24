import React, { useState } from "react";

const GRAD = "linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)";

const requests = [
  {
    id: 1,
    name: "Sara Ahmed",
    avatar: "https://i.pravatar.cc/150?u=sara_a",
    time: "6d",
  },
  {
    id: 2,
    name: "Nour Hassan",
    avatar: "https://i.pravatar.cc/150?u=nour5",
    time: "1w",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    avatar: "https://i.pravatar.cc/150?u=yuki7",
    time: "2w",
  },
];

const contacts = [
  {
    id: 1,
    name: "Khalid Mohammed",
    avatar: "https://i.pravatar.cc/150?u=khalid1",
    online: true,
  },
  {
    id: 2,
    name: "Omar Hassan",
    avatar: "https://i.pravatar.cc/150?u=omar2",
    online: true,
  },
  {
    id: 3,
    name: "Mariam Ali",
    avatar: "https://i.pravatar.cc/150?u=mariam3",
    online: true,
  },
  {
    id: 4,
    name: "Lina Ibrahim",
    avatar: "https://i.pravatar.cc/150?u=lina4",
    online: false,
  },
  {
    id: 5,
    name: "Wael Karim",
    avatar: "https://i.pravatar.cc/150?u=wael5",
    online: true,
  },
  {
    id: 6,
    name: "Ali Mahmoud",
    avatar: "https://i.pravatar.cc/150?u=ali6",
    online: false,
  },
];

function RequestItem({ person, onRemove }) {
  const [status, setStatus] = useState(null);

  const confirm = () => {
    setStatus("confirmed");
    setTimeout(() => onRemove(person.id), 600);
  };
  const decline = () => {
    setStatus("declined");
    setTimeout(() => onRemove(person.id), 400);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        borderRadius: 12,
        opacity: status ? 0.4 : 1,
        transition: "opacity .3s, background .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF7F9")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <img
        src={person.avatar}
        alt={person.name}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: "2px solid #FFAEC9",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 13, color: "#2D0A1A" }}>
            {person.name}
          </span>
          <span style={{ fontSize: 11, color: "#C084A0" }}>{person.time}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button
            onClick={confirm}
            style={{
              padding: "5px 14px",
              background: GRAD,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(255,51,102,0.25)",
            }}
          >
            Confirm
          </button>
          <button
            onClick={decline}
            style={{
              padding: "5px 14px",
              background: "#FFF0F3",
              border: "1.5px solid #FFAEC9",
              borderRadius: 8,
              color: "#C084A0",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FriendReq() {
  const [reqs, setReqs] = useState(requests);
  const remove = (id) => setReqs((prev) => prev.filter((r) => r.id !== id));

  return (
    /* ── Outer sticky wrapper ── */
    <div
      style={{
        fontFamily: "'Nunito', 'Poppins', sans-serif",
        position: "sticky",
        top: 80,
      }}
    >
      {/* ── White card container — matches SideBar ── */}
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
        {/* ── Friend Requests section header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 8px 14px",
            borderBottom: "1.5px solid #FFE4EC",
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 15, color: "#2D0A1A" }}>
            Friend Requests
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              color: "#FF3366",
            }}
          >
            See All
          </button>
        </div>

        {reqs.length === 0 ? (
          <p style={{ fontSize: 13, color: "#C084A0", padding: "8px 10px" }}>
            No pending requests 🎉
          </p>
        ) : (
          reqs.map((r) => (
            <RequestItem key={r.id} person={r} onRemove={remove} />
          ))
        )}

        {/* ── Gradient divider — matches SideBar ── */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #FFAEC9, transparent)",
            margin: "16px 4px",
          }}
        />

        {/* ── Contacts section header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 15, color: "#2D0A1A" }}>
            Contacts
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {["🔍", "⋯"].map((icon) => (
              <button
                key={icon}
                style={{
                  width: 30,
                  height: 30,
                  background: "#FFF0F3",
                  border: "1.5px solid #FFAEC9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 13,
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
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Contact list ── */}
        {contacts.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "9px 10px",
              borderRadius: 12,
              cursor: "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF7F9")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={c.avatar}
                alt={c.name}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #FFAEC9",
                }}
              />
              {c.online && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #fff",
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3D1A28" }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
