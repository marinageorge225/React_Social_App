import React, { useState } from "react";
import { Link } from "react-router";

const GRAD = "linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)";
const SHADOW = "0 8px 40px rgba(255,51,102,0.13)";
const BORDER = "1.5px solid #FFAEC9";
const BORDER_FOCUS = "1.5px solid #FF3366";

function PinkInput({ label, type = "text", icon, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: focused ? "#FF3366" : "#C084A0",
          marginBottom: 4,
          transition: "color .2s",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 15,
              color: focused ? "#FF3366" : "#FFAEC9",
              pointerEvents: "none",
              transition: "color .2s",
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: icon ? "11px 14px 11px 38px" : "11px 14px",
            border: focused ? BORDER_FOCUS : BORDER,
            borderRadius: 12,
            background: "#FFF7F9",
            outline: "none",
            fontSize: 14,
            color: "#3D1A28",
            boxShadow: focused ? "0 0 0 3px rgba(255,51,102,0.08)" : "none",
            transition: "border .2s, box-shadow .2s",
          }}
        />
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Nunito', 'Poppins', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 28,
          padding: "40px 32px",
          boxShadow: SHADOW,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: GRAD,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              marginBottom: 12,
              boxShadow: "0 8px 22px rgba(255,51,102,.3)",
            }}
          >
            💬
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#2D0A1A",
              margin: 0,
            }}
          >
            Welcome back to{" "}
            <span
              style={{
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SocialApp
            </span>
          </h1>
          <p style={{ color: "#C084A0", fontSize: 13, margin: "6px 0 0" }}>
            Sign in to reconnect with your world 🌸
          </p>
        </div>

        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#FFAEC9,transparent)",
            marginBottom: 24,
          }}
        />

        <PinkInput
          label="Email"
          icon="✉️"
          type="email"
          placeholder="jane@example.com"
        />
        <PinkInput
          label="Password"
          icon="🔒"
          type="password"
          placeholder="Your password"
        />

        {/* Remember / Forgot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#C084A0",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" style={{ accentColor: "#FF3366" }} />
            Remember me
          </label>
          <a
            href="#"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#FF3366",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>
        </div>

        {/* CTA */}
        <button
          type="button"
          style={{
            width: "100%",
            padding: 14,
            background: GRAD,
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(255,51,102,.35)",
            letterSpacing: "0.03em",
          }}
        >
          Sign In ✨
        </button>

        {/* OR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "22px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#FFE4EC" }} />
          <span style={{ color: "#FFAEC9", fontSize: 12, fontWeight: 600 }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: "#FFE4EC" }} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {["Google", "Apple", "Facebook"].map((name) => (
            <button
              key={name}
              type="button"
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#FFF7F9",
                border: BORDER,
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                color: "#C084A0",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#C084A0",
            margin: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#FF3366",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Sign Up →
          </Link>
        </p>
      </div>
    </div>
  );
}
