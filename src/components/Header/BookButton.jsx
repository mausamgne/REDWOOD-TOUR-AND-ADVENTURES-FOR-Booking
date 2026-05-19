import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useCart } from "../context/CartContext";   // adjust path if needed
import Button from "../common/Button";
import { toast } from "react-toastify";

export default function BookButton({ text }) {
  const [showAlert, setShowAlert] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
  const token = localStorage.getItem("token");

  // 🔴 NOT LOGGED IN
  if (!token) {
    toast.warning("Please login first to continue booking", {
      position: "top-right",
      autoClose: 2500,
      style: {
        background: "#ffffff",
        color: "#2e7d32",
        border: "1px solid #d4e6d4",
        borderLeft: "4px solid #4F772D",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
      progressStyle: {
        background: "#4F772D",
      },
    });

    return;
  }

  // 🔴 NO ITEMS IN CART
  if (!cartItems || cartItems.length === 0) {
    setShowAlert(true);
    return;
  }

  // ✅ ALL GOOD
  navigate("/review-order");
};

  return (
    <>
      {/* ALERT POPUP */}
      {showAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-6 py-3 shadow-2xl flex items-center gap-6 min-w-[420px] justify-between rounded-md">
            <span className="font-semibold text-lg">
              Please Select a tour for booking
            </span>

            <button
              onClick={() => setShowAlert(false)}
              className="bg-black/80 hover:bg-black text-white px-4 py-1 text-sm font-semibold transition rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* BOOK BUTTON */}
      <Button
        customColor="green-700"
        size="md"
        onClick={handleClick}
        className="h-12 px-6 rounded-lg shadow-md 
                   hover:shadow-xl hover:-translate-y-0.5 
                   transition-all duration-300 
                   uppercase tracking-wide 
                   flex items-center gap-2 text-sm font-semibold"
      >
        <Calendar size={18} />
        {text || "BOOK NOW"}
      </Button>
    </>
  );
}