import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


 
export default function CartIcon() {
  const { cartItems } = useCart();
 
  return (
    <Link to="/cart">
      <div className="relative bg-green-100 p-3 rounded-full">
        <ShoppingCart className="text-primary" />
 
        <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cartItems.length}
        </span>
      </div>
    </Link>
  );
}