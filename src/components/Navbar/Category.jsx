import { useRef, useEffect } from "react";
import NavItemCard from "./NavCard";
import Link from "../common/Link";
import Heading from "../common/Heading";
import PrimaryButton from "../common/PrimaryButton";

export default function CategoryPreview({ category, tours }) {
  const containerRef = useRef(null);

  if (!tours || tours.length === 0) return null;

  useEffect(() => {
    const adjustPosition = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const overflowRight = rect.right - window.innerWidth;
      const overflowLeft = rect.left;

      if (overflowRight > 0) {
        containerRef.current.style.transform = `translateX(-${overflowRight + 20}px)`;
      }

      if (overflowLeft < 0) {
        containerRef.current.style.transform = `translateX(${Math.abs(
          overflowLeft
        ) + 20}px)`;
      }
    };

    adjustPosition();
    window.addEventListener("resize", adjustPosition);

    return () => window.removeEventListener("resize", adjustPosition);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 z-50 w-[850px] max-w-[95vw]"
    >
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">

        <div className="bg-[#f3f4f2] border border-green-700 rounded-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-[#5e8d3b] px-5 py-3">
            <Heading
              as="h3"
              className="text-white text-sm font-semibold truncate m-0"
            >
              {category.cat_main_title || category.cat_name}
            </Heading>
          </div>

          {/* TOUR LIST */}
          <div className="divide-y divide-green-300">
            {tours.slice(0, 3).map((tour) => (
  <NavItemCard
    key={tour._id || tour.id}
    tour={tour}
  />
))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#ececec]">
            {/* <span className="text-xs font-semibold text-gray-600">
              VIEW ALL
            </span> */}

            {/* <Link href={`/${category.cat_slug}`}>
              <PrimaryButton className="px-4 py-1.5 text-xs rounded-full bg-primary-700 hover:bg-green-800 whitespace-nowrap">
                MORE DETAILS →
              </PrimaryButton>
            </Link> */}
          </div>

        </div>
      </div>
    </div>
  );
}