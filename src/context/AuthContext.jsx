import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const userToken = localStorage.getItem("token");
  useEffect(() => {
    if (userToken) {
      setToken(userToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
