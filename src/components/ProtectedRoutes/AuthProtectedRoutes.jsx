import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

function AuthProtectedRoutes({ children }) {
  // const userToken = localStorage.getItem("token");
  const navigate = useNavigate();
  let { token } = useContext(AuthContext);
  const userToken = token;
  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [userToken]);
  return children;
}

export default AuthProtectedRoutes;
