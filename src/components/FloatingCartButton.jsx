// src/components/FloatingCartButton.jsx
import { FaShoppingCart } from "react-icons/fa";

const FloatingCartButton = ({ onClick, cantidad }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 relative"
      >
        <FaShoppingCart size={24} />
        {cantidad > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cantidad}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartButton;
