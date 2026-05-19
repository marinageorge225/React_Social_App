import React from "react";

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
