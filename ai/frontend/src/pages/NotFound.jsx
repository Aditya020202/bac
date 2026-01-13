import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-sm text-gray-500 mb-4">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFound;

