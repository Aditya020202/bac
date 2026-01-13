import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        api.get("/admin/products/pending"),
        api.get("/admin/stats")
      ]);
      setPending(p.data);
      setStats(s.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/products/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await api.post(`/admin/products/${id}/reject`);
    load();
  };

  if (loading && !stats) return <Loader />;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Admin dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
          <p className="font-semibold mb-1">Students by college</p>
          <ul className="text-xs space-y-1">
            {stats?.usersByCollege?.map((c) => (
              <li key={c._id} className="flex justify-between">
                <span>{c._id}</span>
                <span>{c.count}</span>
              </li>
            )) || <li className="text-gray-500">No data</li>}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
          <p className="font-semibold mb-1">Listings by college</p>
          <ul className="text-xs space-y-1">
            {stats?.productsByCollege?.map((c) => (
              <li key={c._id} className="flex justify-between">
                <span>{c._id}</span>
                <span>{c.total}</span>
              </li>
            )) || <li className="text-gray-500">No data</li>}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
          <p className="font-semibold mb-1">Pending approvals</p>
          <p className="text-3xl font-bold">{pending.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
        <h3 className="font-semibold mb-3">Pending product approvals</h3>
        {pending.length === 0 && (
          <p className="text-xs text-gray-500">No pending products.</p>
        )}
        <ul className="space-y-2">
          {pending.map((p) => (
            <li
              key={p._id}
              className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-2"
            >
              <div className="text-xs">
                <p className="font-medium">{p.title}</p>
                <p className="text-gray-500">
                  ${p.price} • {p.category} • {p.college}
                </p>
                <p className="text-gray-500">
                  Seller: {p.seller?.name} ({p.seller?.email})
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve(p._id)}
                  className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(p._id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-xs"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AdminDashboard;

