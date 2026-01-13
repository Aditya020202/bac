import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const emptyForm = {
  title: "",
  price: "",
  category: "",
  condition: "",
  description: ""
};

const AddProduct = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const draft = location.state?.draft;
    if (draft) {
      setForm({
        title: draft.title,
        price: draft.price,
        category: draft.category,
        condition: draft.condition,
        description: draft.description
      });
    }
  }, [location.state]);

  useEffect(() => {
    const load = async () => {
      if (!editing) return;
      setLoadingInitial(true);
      try {
        const res = await api.get(`/products/${id}`);
        setForm({
          title: res.data.title,
          price: res.data.price,
          category: res.data.category,
          condition: res.data.condition,
          description: res.data.description
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInitial(false);
      }
    };
    load();
  }, [editing, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const submit = async (isDraft) => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("isDraft", isDraft ? "true" : "false");
      images.forEach((file) => formData.append("images", file));

      if (editing) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      navigate("/profile");
    } catch (e) {
      setError(e.response?.data?.message || "Unable to save product");
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {editing ? "Edit listing" : "Add a new listing"}
      </h2>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(false);
        }}
        className="space-y-3 text-sm"
      >
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-transparent"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-transparent"
            >
              <option value="">Select</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-transparent"
            >
              <option value="">Select</option>
              <option value="new">New</option>
              <option value="like-new">Like new</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="w-full text-xs"
              accept="image/*"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-transparent"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Publish for approval"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => submit(true)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            Save as draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

