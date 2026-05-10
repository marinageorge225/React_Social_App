import React from "react";
import authImg1 from "../../assets/auth/mobile.jpg";
import authImg2 from "../../assets/auth/mobile2.jpg";
import authImg3 from "../../assets/auth/mobile3.jpg";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <>
      <div className="container mx-auto h-screen my-10 ">
        <div className="flex justify-center items-center">
          <div className="w-1/3">
            <img
              src={authImg2}
              alt="authentication Image "
              className="w-full h-full object-cover rounded-3xl"
            ></img>
          </div>
          <div className="w-2/3">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthLayout;
