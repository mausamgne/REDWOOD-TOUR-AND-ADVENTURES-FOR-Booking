import { createContext, useContext, useState, useEffect } from "react";
import {toast} from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
  const updatedCart = cartItems.map(item => ({
    ...item,

    // 🔥 FORCE DATE SAVE
    date: item.date || null
  }));

  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
}, [cartItems]);

  /* ================= PRICE ENGINE ================= */
  const calculateItemTotal = (item) => {
  return Number(item.price || 0); // 🔥 already total price
};

  /* ================= ADD TO CART ================= */
  const addToCart = (newItem) => {
  const bookingDate =
    newItem.travelDate ||
    newItem.date ||
    new Date().toISOString().split("T")[0];

  const updatedItem = {
    ...newItem,
    title: newItem.title,
    date: bookingDate,
    travelDate: bookingDate,
  };

  setCartItems((prev) => {

    // ✅ DUPLICATE CHECK
    const alreadyBooked = prev.some(
      (item) =>
        item.title?.trim().toLowerCase() ===
          updatedItem.title?.trim().toLowerCase() &&
        item.travelDate === updatedItem.travelDate
    );

    // ❌ BLOCK SAME TOUR + SAME DATE
    if (alreadyBooked) {
      toast.error(
        "You already booked this tour for this date."
      );

      return prev;
    }

    // ✅ ADD NEW
    return [...prev, updatedItem];
  });
};
  /* ================= REMOVE ================= */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = (id, quantity) => {
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.id !== id) return item;

      const isSUV = item.vehicle?.name === "SUV";

      const updatedTotal = isSUV
        ? item.price * quantity   // SUV → change hoga
        : item.price;             // VAN → fixed

      return {
        ...item,
        quantity,
        total: updatedTotal
      };
    })
  );
};
  /* ================= CLEAR CART (🔥 NEW FIX) ================= */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  /* ================= SUMMARY ================= */
  const subtotal = cartItems.reduce((sum, item) => {
  const isSUV = item.vehicle?.name === "SUV";

  return sum + (isSUV
    ? item.price * item.quantity
    : item.price);
}, 0);

  const taxAmount = 0;
  const grandTotal = subtotal + taxAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateItemTotal,
        subtotal,
        taxAmount,
        grandTotal,
        clearCart, // ✅ IMPORTANT ADD
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);