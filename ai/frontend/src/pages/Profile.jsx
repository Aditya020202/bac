import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [l, p, w, r] = await Promise.all([
        api.get("/users/me/listings"),
        api.get("/users/me/purchases"),
        api.get("/users/wishlist"),
        api.get("/users/recently-viewed")
      ]);
      setListings(l.data);
      setPurchases(p.data);
      setWishlist(w.data);
      setRecent(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markSold = async (id) => {
    await api.post(`/products/${id}/mark-sold`);
    loadData();
  };

  const deleteListing = async (id) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  const removeFromWishlist = async (id) => {
    await api.post(`/users/wishlist/${id}`);
    loadData();
  };

  if (!user) return null;
  if (loading) return <Loader />;

  const active = listings.filter((p) => p.status !== "draft");
  const drafts = listings.filter((p) => p.status === "draft");

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Hi, {user.name}</h2>
          <p className="text-xs text-gray-500">
            {user.email} • {user.college}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/add-product"
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
          >
            Add listing
          </Link>
          <button
            onClick={() => {
              logout().then(() => navigate("/"));
            }}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
          <h3 className="font-semibold mb-2">My listings</h3>
          {active.length === 0 && (
            <p className="text-xs text-gray-500">No listings yet.</p>
          )}
          <ul className="space-y-2">
            {active.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-gray-500">
                    ${p.price} • {p.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-product/${p._id}`)}
                    className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => markSold(p._id)}
                    className="px-2 py-1 rounded-md bg-emerald-600 text-white"
                  >
                    Sold
                  </button>
                  <button
                    onClick={() => deleteListing(p._id)}
                    className="px-2 py-1 rounded-md bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
          <h3 className="font-semibold mb-2">Drafts</h3>
          {drafts.length === 0 && (
            <p className="text-xs text-gray-500">No drafts.</p>
          )}
          <ul className="space-y-2">
            {drafts.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-gray-500">${p.price}</p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/add-product`, {
                      state: { draft: p }
                    })
                  }
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                >
                  Continue
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
          <h3 className="font-semibold mb-2">Purchase history</h3>
          {purchases.length === 0 && (
            <p className="text-xs text-gray-500">No purchases yet.</p>
          )}
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li key={p._id} className="text-xs">
                <p className="font-medium">{p.title}</p>
                <p className="text-gray-500">${p.price}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
          <h3 className="font-semibold mb-2">Wishlist</h3>
          {wishlist.length === 0 && (
            <p className="text-xs text-gray-500">No items in wishlist.</p>
          )}
          <ul className="space-y-2">
            {wishlist.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-gray-500">${p.price}</p>
                </div>
                <button
                  onClick={() => removeFromWishlist(p._id)}
                  className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
        <h3 className="font-semibold mb-2">Recently viewed</h3>
        {recent.length === 0 && (
          <p className="text-xs text-gray-500">No recently viewed items.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {recent.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="text-xs bg-gray-50 dark:bg-gray-800 rounded-md p-2"
            >
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-gray-500">${p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;

