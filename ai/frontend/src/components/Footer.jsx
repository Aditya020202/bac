import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-500">
      <p>© {new Date().getFullYear()} College Marketplace. For students, by students.</p>
    </footer>
  );
};

export default Footer;

