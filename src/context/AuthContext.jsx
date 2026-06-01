import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const userToken = localStorage.getItem("token");
  const [profileData, setProfileData] = useState(null);
  useEffect(() => {
    if (userToken) {
      setToken(userToken);
    }
  }, []);

  async function getUserProfile() {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${baseurl}/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("FULL RESPONSE:", response.data);

    setProfileData(response.data.data.user);
  }
  useEffect(() => {
    if (token) {
      getUserProfile();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        profileData,
        setProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
