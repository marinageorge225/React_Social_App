import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

function AppProtectedRoutes({ children }) {
  // const userToken = localStorage.getItem("token");
  const navigate = useNavigate();
  let { token } = useContext(AuthContext);
  const userToken = token;

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken]);
  return children;
}

export default AppProtectedRoutes;
