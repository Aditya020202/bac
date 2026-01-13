import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <section className="py-12 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          A{" "}
          <span className="text-indigo-600">
            college-only marketplace
          </span>{" "}
          for buying, selling, and renting on campus.
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-xl">
          Verified students only, secure deals within your college, and an admin-backed
          community so you can trade textbooks, gadgets, and more with confidence.
        </p>
        <div className="flex gap-3">
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Get started
          </Link>
          <Link
            to="/marketplace"
            className="px-4 py-2 rounded-md border text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Browse marketplace
          </Link>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <p className="font-semibold mb-1">Verified .edu access</p>
          <p className="text-gray-500">
            Only students with approved college emails can sign up.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <p className="font-semibold mb-1">Admin moderation</p>
          <p className="text-gray-500">
            College admins approve listings and handle reports.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <p className="font-semibold mb-1">Built for campus life</p>
          <p className="text-gray-500">
            Trade textbooks, furniture, and more without leaving campus.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <p className="font-semibold mb-1">Dark mode</p>
          <p className="text-gray-500">
            Late-night browsing with a comfortable dark theme.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Landing;

