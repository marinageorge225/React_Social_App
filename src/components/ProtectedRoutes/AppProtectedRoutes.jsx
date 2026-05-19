import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function AppProtectedRoutes({ children }) {
  const userToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken]);
  return children;
}

export default AppProtectedRoutes;
