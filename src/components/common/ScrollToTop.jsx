import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 bottom-10 z-[9999] w-16 h-16 rounded-full bg-[#4f8a34] text-white shadow-2xl flex items-center justify-center hover:bg-[#3f6f1d] transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp size={32} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}