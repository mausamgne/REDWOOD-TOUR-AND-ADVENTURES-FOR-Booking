import { useEffect } from "react";
import { X, Home, ChevronDown } from "lucide-react";
import Heading from "../common/Heading";

export default function MobileDrawer({ items, open, setOpen }) {
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#5E8A34] text-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Home size={24} />
            <Heading as="h2" className="text-xl font-semibold tracking-wide">
              
            </Heading>
          </div>

          <X
            size={24}
            className="cursor-pointer hover:rotate-90 transition-transform duration-300"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col py-4 overflow-y-auto">
          {items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-6 py-4 text-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <span>{item.cat_name}</span>
              <ChevronDown size={18} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
