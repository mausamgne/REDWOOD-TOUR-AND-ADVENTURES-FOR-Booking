import Link from "../common/Link";
import Text from "../common/Text";

export default function FooterBottomNav({ tours }) {
  if (!Array.isArray(tours) || tours.length === 0) return null;

  return (
    <div className="border-t border-gray-800 bg-[#1a1a1a]">
      <div className="max-w-[1300px] mx-auto px-8 lg:px-16 py-8">

        <div className="flex flex-wrap justify-center items-center gap-6 text-center">
          {tours.map((tour, index) => (
            <div key={tour.id} className="flex items-center gap-6">

              <Link href={`/${tour.cat_slug}`}>
                <Text className="text-[#17c964] text-lg font-semibold tracking-wide hover:text-white transition duration-300">
                  {tour.footer_title}
                </Text>
              </Link>

              {index !== tours.length - 1 && (
                <span className="text-gray-600 text-lg">|</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
