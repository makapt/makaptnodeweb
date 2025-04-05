import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="w-full overflow-hidden">
      <ToastContainer />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
