import { Link } from "react-router-dom";
import Text from "../common/Text";

const footerSlugMap = {
  "Redwood National Park": "redwood",
  Alcatraz: "alcatraz",
  "Muir Woods": "muir-woods",
  SF: "san-francisco",
  Yosemite: "yosemite",
  Napa: "wine-country",
  "Lake Tahoe": "lake-tahoe",
};

const makeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function FooterBottomNav({ tours }) {
  if (!Array.isArray(tours) || tours.length === 0) return null;

  const getCategorySlug = (tour) => {
    return (
      footerSlugMap[tour?.footer_title] ||
      tour?.cat_slug ||
      makeSlug(tour?.footer_title || "")
    );
  };

  return (
    <div className="border-t border-gray-800 bg-[#1a1a1a]">
      <div className="max-w-[1300px] mx-auto px-8 lg:px-16 py-8">
        <div className="flex flex-wrap justify-center items-center gap-6 text-center">
          {tours.map((tour, index) => {
            const slug = getCategorySlug(tour);

            return (
              <div key={tour.id || index} className="flex items-center gap-6">
                <Link to={`/category/${slug}`}>
                  <Text className="text-[#17c964] text-lg font-semibold tracking-wide hover:text-white transition duration-300">
                    {tour.footer_title}
                  </Text>
                </Link>

                {index !== tours.length - 1 && (
                  <span className="text-gray-600 text-lg">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}