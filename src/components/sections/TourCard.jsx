import { Link } from "react-router-dom";
import Pill from "../common/Pill";
import PrimaryButton from "../common/PrimaryButton";
import Heading from "../common/Heading";
import Text from "../common/Text";

export default function TourCard({
  image,
  badges = [],
  title,
  description,
  reviews,
  rating = 5,
  slug,
  buttonText = "MORE DETAILS"
}) {
  return (
    <div className="group bg-white rounded-2xl border border-green-200 overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={image || "https://via.placeholder.com/400x300"}
          alt={title || "Tour Image"}
          className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {badges.map((badge, index) => (
            <Pill key={index}>{badge}</Pill>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">

        <Heading
          as="h3"
          align="left"
          className="text-lg font-bold text-gray-800 mb-3 leading-snug"
        >
          {title || "No Title"}
        </Heading>

        <Text className="text-sm text-gray-600 mb-6 leading-relaxed">
          {description
            ? description.slice(0, 150) + "..."
            : "No description available"}
        </Text>

        <div className="flex justify-between items-center mt-auto">

          <Link to={`/tour/${slug}`}>
            <PrimaryButton>
              {buttonText}
            </PrimaryButton>
          </Link>

          <div className="text-green-700 font-semibold text-sm">
  
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-lg ${
          star <= Math.round(rating)
            ? "text-yellow-400"
            : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>

  <div className="text-xs text-gray-500">
    {reviews} Reviews
  </div>
</div>

        </div>

      </div>
    </div>
  );
}
