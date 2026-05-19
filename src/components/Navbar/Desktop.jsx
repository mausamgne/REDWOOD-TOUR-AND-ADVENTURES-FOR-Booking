import { useState } from "react";
import { Home } from "lucide-react";
import Link from "../common/Link";
import CategoryPreview from "./Category";

export default function DesktopNav({ items = [] }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const filteredItems = items.filter(
    (item) => item.cat_name !== "Muir Woods Full Day Tour"
  );

  return (
    <div
      className="max-w-7xl mx-auto"
      onMouseLeave={() => setActiveMenu(null)}
    >
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
                  className="transition-all duration-200 hover:opacity-80"
                >
                  {item.cat_name}
                </button>

                {/* ✅ DROPDOWN */}
                {isActive && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50">

                    {/* ✅ GREEN BORDER ARROW */}
                    <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-0 h-0
                      border-l-[14px] border-l-transparent
                      border-r-[14px] border-r-transparent
                      border-b-[14px] border-b-primary">
                    </div>

                    {/* ✅ WHITE ARROW */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
                      border-l-[12px] border-l-transparent
                      border-r-[12px] border-r-transparent
                      border-b-[12px] border-b-white">
                    </div>

                    <CategoryPreview
                      category={item}
                      tours={item?.tours}
                    />

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