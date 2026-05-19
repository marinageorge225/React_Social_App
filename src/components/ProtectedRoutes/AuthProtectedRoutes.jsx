import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function AuthProtectedRoutes({ childer }) {
  const userToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [userToken]);
  return children;
}

export default AuthProtectedRoutes;
