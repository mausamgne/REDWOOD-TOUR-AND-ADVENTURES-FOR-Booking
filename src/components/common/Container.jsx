import NavItemCard from "../Navbar/NavCard";
import Link from "./Link";
 
export default function CategoryPreview({ category, tours }) {
  if (!tours?.length) return null;
 
  return (
    <div className="w-full bg-white shadow-2xl">
 
      <div className="max-w-6xl mx-auto py-8 px-6">
 
        {/* MAIN CONTAINER */}
        <div className="rounded-3xl border-2 border-green-700 overflow-hidden bg-gray-100">
 
          {/* GREEN HEADER */}
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              {category.cat_main_title || category.cat_name}
            </h2>
          </div>
 
          {/* TOUR LIST */}
          <div className="divide-y divide-green-600">
 
            {tours.slice(0, 3).map((tour) => (
              <div key={tour.id} className="bg-gray-200 px-6 py-5">
                <NavItemCard tour={tour} />
              </div>
            ))}
 
            {/* FOOTER */}
            <div className="flex items-center justify-between px-6 py-5 bg-gray-200">
              <span className="font-semibold text-gray-700">
                VIEW ALL
              </span>
 
              <Link
                href={`/${category.cat_slug}`}
                className="bg-green-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-900 transition"
              >
                MORE DETAILS →
              </Link>
            </div>
 
          </div>
 
        </div>
 
      </div>
    </div>
  );
}