import { Menu } from "lucide-react";
import PhoneInfo from "./Phone";
import LiveChatButton from "./LiveChat";
import CountrySelector from "./CountryDropdown";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 🔥 ADD THESE
import { useEffect, useState } from "react";

export default function TopBar({
  contactNumber,
  languages,
  setDrawerOpen,
  chatLink,
  chatText,
  onLanguageChange,
  currentLangId   
}) {

  const navigate = useNavigate();

  // 🔥 ADD STATE
  const [user, setUser] = useState(null);

  // 🔥 LOAD USER FROM LOCALSTORAGE
  useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  // 🔥 initial load
  loadUser();

  // 🔥 listen for login/logout
  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("storage", loadUser);
  };
}, []);
const handleLogout = () => {
  // 🔥 remove data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // 🔥 UI update
  setUser(null);

  // 🔔 Toast message
  toast.success("Logout successful 👋", {
  autoClose: 1000, // ⏱️ 
  style: {
    background: "#e8f5e9",
    color: "#2e7d32",
    borderLeft: "5px solid #4caf50",
  },
});

  // 🔄 redirect
  setTimeout(() => {
    navigate("/");
  }, 700);
};

  return (
    <div className="w-full bg-[#4F772D] text-white">
      <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Menu
            size={26}
            className="cursor-pointer hover:scale-110 transition lg:hidden"
            onClick={() => setDrawerOpen(true)}
          />
          <PhoneInfo phone={contactNumber} />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <LiveChatButton
            chatLink={chatLink}
            chatText={chatText}
          />

          {/* 🔥 UPDATED LOGIN / USER UI */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                Hi, {user.firstName}
              </span>

              <button
                onClick={handleLogout}
                className="bg-white text-red-500 px-3 py-1 rounded font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-[#4F772D] px-4 py-1 rounded font-semibold hover:bg-gray-100"
            >
              Login
            </button>
          )}

          <CountrySelector
            languages={languages}
            onLanguageChange={onLanguageChange}
            currentLangId={currentLangId}  
          />

        </div>

      </div>
    </div>
  );
}