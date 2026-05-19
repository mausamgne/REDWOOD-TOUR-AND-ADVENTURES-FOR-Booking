import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function LiveChatButton({ chatLink, chatText }) {

  const [clicked, setClicked] = useState(false);

  const openChat = () => {

    // ✅ Tawk chat support
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
      setClicked(true);
      return;
    }

    // ✅ External chat link support
    if (chatLink) {

      const cleanLink = chatLink.replace(/\\/g, "");

      setClicked(true);

      window.open(
        cleanLink,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    // ❌ no chat available
    alert("Live chat unavailable");
  };

  return (
    <button
      onClick={openChat}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md transition
        ${
          clicked
            ? "bg-gray-500 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }
      `}
    >
      <MessageCircle size={18} />

      {chatText || "Live Chat"}
    </button>
  );
}