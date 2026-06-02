import { useCart } from "../components/context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {AdminPanel} from "..pages/AdminPanel";

export default function Cart() {

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    calculateItemTotal,
    subtotal,
    taxAmount,
    grandTotal
  } = useCart();

  const navigate = useNavigate();


  const handleCheckout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.warning(
      <div className="flex flex-col gap-2">
        <span className="font-medium">
          Please login to continue checkout
        </span>

        <button
          onClick={() => navigate("/login")}
          className="bg-[#4F772D] hover:bg-[#3d5f24] text-white px-3 py-1 rounded text-sm w-fit"
        >
          Login Now
        </button>
      </div>,
      {
        position: "top-right",
        autoClose: 2500,
        icon: false, // 
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
      }
    );

    return;
  }


  // ✅ GET PREVIOUS ORDERS
const previousOrders =
  JSON.parse(localStorage.getItem("placedOrders")) || [];

// ✅ CHECK DUPLICATE
const duplicateBooking = cartItems.some((cartItem) => {

  const currentTitle =
    cartItem.title?.trim().toLowerCase();

  const currentDate =
    cartItem.travelDate || cartItem.date;

  return previousOrders.some((order) => {

    const savedTitle =
      order.title?.trim().toLowerCase();

    const savedDate =
      order.travelDate || order.date;

    return (
      savedTitle === currentTitle &&
      savedDate === currentDate
    );
  });
});

// ❌ BLOCK SAME BOOKING
if (duplicateBooking) {
  toast.error(
    "You already booked this tour for this date."
  );

  return;
}
  navigate("/review-order");
};

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
console.log(cartItems);
  return (
    <div className="bg-[#f4f6f3] min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="bg-[#6b3f2a] text-white text-center py-4 text-lg font-semibold mb-6 rounded">
          SECURE SHOPPING CART – SHOP WITH CONFIDENCE
        </div>

        <p className="mb-6 text-lg">
          Your shopping cart has{" "}
          <span className="text-[#4a6b2f] font-bold">
            {cartItems.length}
          </span>{" "}
          tour(s).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">

            <div className="hidden md:grid grid-cols-4 bg-[#4a6b2f] text-white font-semibold p-4 rounded-t">
              <div>Tour Details</div>
              <div className="text-center">Price per person</div>
              <div className="text-center">No. of guests</div>
              <div className="text-center">Amount per tour</div>
            </div>

            {cartItems.map((item) => {

  const quantity = Number(item.quantity || 1);
  const vehicle = item.vehicle;

  // 🔥 DYNAMIC PRICE CALCULATION
  const matchedRange = vehicle?.allpricerange?.find((range) => {
    const from = Number(range.seats_from);
    const to = Number(range.seats_to);
    return quantity >= from && quantity <= to;
  });

  const basePrice = Number(matchedRange?.price || 0);
  const isSUV = vehicle?.name === "SUV";

  // ✅ FINAL VALUES
  const pricePerPerson = basePrice;
  const totalForTour = isSUV
    ? basePrice * quantity   // SUV → per person
    : basePrice;             // VAN → fixed (slab based)

  const maxPassengers = Number(vehicle?.max_passengers || 7);

  return (
    
    <div
      key={item.id}
      className="grid grid-cols-1 md:grid-cols-4 border border-[#4a6b2f] bg-white"
    >
      {/* LEFT */}
      <div className="p-4 border-r border-[#4a6b2f]">
        <p className="font-semibold text-[#4a6b2f] text-lg">
          {item.title}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          ({item.date}, {quantity} Guests)
        </p>

        <p className="text-sm text-gray-600">
          By {vehicle?.name || "N/A"}
        </p>

        {item.hotel && (
          <p className="text-sm text-green-600">
            Hotel Included
          </p>
        )}

        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 text-sm mt-2"
        >
          Remove
        </button>
      </div>

      {/* PRICE PER PERSON */}
      <div className="flex items-center justify-center border-r border-[#4a6b2f]">
        ${formatPrice(pricePerPerson)}
      </div>

      {/* GUEST SELECT */}
      <div className="flex items-center justify-center border-r border-[#4a6b2f]">
        <select
          value={quantity}
          onChange={(e) =>
            updateQuantity(item.id, Number(e.target.value))
          }
          className="border px-3 py-1 rounded"
        >
          {Array.from({ length: maxPassengers }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-center font-bold text-[#4a6b2f]">
        ${formatPrice(totalForTour)}
      </div>
    </div>
  );
})}

            <Link
              to="/"
              className="block bg-[#4a6b2f] text-white text-center py-4 mt-6 font-semibold rounded"
            >
               CLICK HERE TO ADD MORE TOURS
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-6 rounded shadow h-fit">

            <h2 className="text-2xl text-[#4a6b2f] font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between py-3 border-b">
              <span>Subtotal</span>
              <span>${formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span>Tax</span>
              <span>${formatPrice(taxAmount)}</span>
            </div>

            <div className="flex justify-between py-4 font-bold text-lg">
              <span>Grand Total</span>
              <span>${formatPrice(grandTotal)}</span>
            </div>

            <button
  onClick={handleCheckout}
  disabled={cartItems.length === 0}
  className="w-full bg-[#6b3f2a] text-white py-3 rounded mt-4"
>
  CHECKOUT →
</button>

          </div>
        </div>
      </div>
    </div>
  );
}
// export {AdminPanel};