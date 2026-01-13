import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-lg">
          College<span className="text-indigo-600">Market</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-indigo-600" : "text-gray-600 dark:text-gray-300"}`
            }
          >
            Marketplace
          </NavLink>
          {user && user.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm ${isActive ? "text-indigo-600" : "text-gray-600 dark:text-gray-300"}`
              }
            >
              Admin
            </NavLink>
          )}
          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm ${isActive ? "text-indigo-600" : "text-gray-600 dark:text-gray-300"}`
              }
            >
              Dashboard
            </NavLink>
          )}
          <ThemeToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

