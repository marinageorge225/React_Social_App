import React from "react";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router";
import NavbarComponent from "../../components/Navbar/Navbar";
function MainLayout() {
  return (
    <>
      <NavbarComponent />
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
}

export default MainLayout;
