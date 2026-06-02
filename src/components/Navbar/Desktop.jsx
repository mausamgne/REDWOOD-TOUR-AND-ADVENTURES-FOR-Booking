import { useState } from "react";
import { Home } from "lucide-react";
import Link from "../common/Link";
import CategoryPreview from "./Category";
import { useNavigate } from "react-router-dom";

export default function DesktopNav({ items = [] }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const makeSlug = (value = "") =>
    String(value)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getCategorySlug = (item) =>
    item?.cat_slug || makeSlug(item?.cat_name || "");

  const filteredItems = items.filter(
    (item) => item.cat_name !== "Muir Woods Full Day Tour",
  );

  return (
    <div className="max-w-7xl mx-auto" onMouseLeave={() => setActiveMenu(null)}>
      <div className="w-full flex items-center justify-between h-[60px] px-6 text-white font-semibold">
        {/* HOME ICON */}
        <Link
          href="/"
          className="flex items-center justify-center mr-10 hover:opacity-80 transition"
        >
          <Home size={30} />
        </Link>

        {/* NAV ITEMS */}
        <div className="flex items-center gap-16 whitespace-nowrap text-[18px] flex-1 justify-between">
          {filteredItems.map((item) => {
            const isActive = activeMenu === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.id)}
              >
                {/* ✅ underline removed */}
                <button
                  onClick={() => navigate(`/category/${getCategorySlug(item)}`)}
                  className="transition-all duration-200 hover:opacity-80"
                >
                  {item.cat_name}
                </button>

                {/* ✅ DROPDOWN */}
              {isActive && (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">

    <div
      className="
        absolute
        top-1
        left-1/2
        -translate-x-1/2
        w-6
        h-6
        bg-white
        rotate-45
        border-l
        border-t
        border-gray-200
        shadow-sm
        z-10
      "
    />

    <CategoryPreview category={item} tours={item?.tours} />
  </div>
)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
