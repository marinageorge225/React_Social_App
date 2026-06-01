import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthContextProvider from "./context/AuthContext";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
