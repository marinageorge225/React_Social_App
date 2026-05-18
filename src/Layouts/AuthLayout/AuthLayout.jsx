import React from "react";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF0F3 0%, #FFE4EC 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "fixed",
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle,#FF6B9D33,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle,#FF336622,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Full-width outlet — Register/Login fill this */}
      <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
