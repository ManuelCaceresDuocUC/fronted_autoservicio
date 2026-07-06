// src/components/FloatingCartButton.jsx
import { FaShoppingCart } from "react-icons/fa";

const FloatingCartButton = ({ onClick, cantidad }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="bg-green-500 text-white p-5 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 relative group"
      >
        <FaShoppingCart size={26} className="group-hover:animate-pulse" />
        {cantidad > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-sm">
            {cantidad}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCartButton;