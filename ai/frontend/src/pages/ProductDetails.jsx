import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      if (user) {
        await api.post(`/users/recently-viewed/${id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sendMessage = async () => {
    if (!message.trim() || !product) return;
    setChatLoading(true);
    try {
      await api.post("/messages", {
        productId: product._id,
        receiverId: product.seller._id,
        content: message
      });
      setMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await api.post(`/products/${id}/report`, { reason: reportReason });
      setReportReason("");
    } catch (e) {
      console.error(e);
    } finally {
      setReporting(false);
    }
  };

  if (loading || !product) return <Loader />;

  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">{product.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {product.condition} • {product.category} • {product.college}
          </p>
          <p className="text-indigo-600 font-bold text-lg mb-3">${product.price}</p>
          <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm">
          <p className="font-semibold mb-1">Seller</p>
          <p>{product.seller?.name}</p>
          <p className="text-xs text-gray-500">
            {product.seller?.college} •{" "}
            {product.seller?.averageRating
              ? `⭐ ${product.seller.averageRating.toFixed(1)}`
              : "No ratings yet"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm space-y-3">
          <p className="font-semibold">Message seller</p>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about availability, pickup, etc."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 text-xs bg-transparent"
          />
          <button
            disabled={chatLoading}
            onClick={sendMessage}
            className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {chatLoading ? "Sending..." : "Send message"}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 text-sm space-y-3">
          <p className="font-semibold">Report listing</p>
          <textarea
            rows={2}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue with this item."
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 text-xs bg-transparent"
          />
          <button
            disabled={reporting}
            onClick={submitReport}
            className="w-full px-3 py-2 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60"
          >
            {reporting ? "Reporting..." : "Report"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;

