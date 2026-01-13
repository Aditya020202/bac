import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    condition: "",
    minPrice: "",
    maxPrice: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: { ...filters, page, limit: 12 }
      });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Marketplace</h2>
      <form
        onSubmit={handleFilterSubmit}
        className="grid md:grid-cols-6 gap-3 mb-4 text-xs"
      >
        <input
          type="text"
          placeholder="Search"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 md:col-span-2 bg-transparent"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 bg-transparent"
        >
          <option value="">Category</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filters.condition}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 bg-transparent"
        >
          <option value="">Condition</option>
          <option value="new">New</option>
          <option value="like-new">Like new</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
        <input
          type="number"
          placeholder="Min $"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 bg-transparent"
        />
        <input
          type="number"
          placeholder="Max $"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-2 bg-transparent"
        />
        <button
          type="submit"
          className="md:col-span-6 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Apply
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {items.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No items found.</p>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 text-xs">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Marketplace;

