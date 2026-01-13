import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;

