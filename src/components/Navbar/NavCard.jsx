import Badge from "../common/Badge";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../common/PrimaryButton";
import Heading from "../common/Heading";

export default function NavItemCard({ tour }) {

  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 bg-[#f3f4f2] hover:bg-[#ececec] transition duration-200 cursor-pointer"
      onClick={() => navigate(`/tour/${tour?.tour_slug}`)}
    >

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-1 min-w-0">

        {/* IMAGE */}
        <div className="w-24 h-16 rounded-md overflow-hidden shrink-0">
          <img
            src={tour?.tour_thumbnail}
            alt={tour?.tour_title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <Heading
            as="h5"
            className="text-sm font-semibold text-gray-800 truncate"
          >
            {tour?.tour_title}
          </Heading>

          {/* BADGES */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {tour?.is_popular && (
              <Badge className="text-[10px] px-2 py-[2px]">
                POPULAR
              </Badge>
            )}

            {tour?.is_recommended && (
              <Badge className="text-[10px] px-2 py-[2px]">
                RECOMMENDED
              </Badge>
            )}

            {tour?.is_top && (
              <Badge className="text-[10px] px-2 py-[2px]">
                TOP
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="shrink-0">

        <PrimaryButton
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tour/${tour?.tour_slug}`);
          }}
          className="px-4 py-1.5 text-xs rounded-full bg-primary-700 hover:bg-green-800 whitespace-nowrap"
        >
          DETAILS →
        </PrimaryButton>

      </div>

    </div>
  );
}