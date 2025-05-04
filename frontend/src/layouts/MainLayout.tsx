import React from "react";
import { Outlet } from "react-router-dom";
import "../index.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark_bg/40 text-black dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-1 container min-w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
