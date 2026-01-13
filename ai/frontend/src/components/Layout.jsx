import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

