import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition flex flex-col"
    >
      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
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
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-sm truncate">{product.title}</h3>
        <p className="text-indigo-600 font-semibold text-sm">${product.price}</p>
        <p className="text-[11px] text-gray-500">
          {product.condition} • {product.college}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

