import { useEffect, useState, useRef } from "react";
import TourCard from "./TourCard";
import SectionHeading from "../common/SectionHeading";
import PrimaryButton from "../common/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function SanFranciscoToursSection({
  tours = [],
  sectionTitle,
  categorySlug
}) {
//   const [tours, setTours] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [transition, setTransition] = useState(true);
  const navigate = useNavigate();

  const trackRef = useRef(null);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     fetch(
//       "https://adminzwy8.redwoodnationalparktours.com/api/get_homepage?lang_id=1&website_id=1"
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const sanFranciscoCategory = data?.top_navigation?.find(
//           (cat) =>
//             cat.cat_name?.toLowerCase().includes("san francisco")
//         );

//         if (sanFranciscoCategory) {
//           setTours(sanFranciscoCategory.tours || []);
//         }
//       })
//       .catch((err) =>
//         console.log("Error fetching San Francisco Tours:", err)
//       );
//   }, []);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;

      if (width < 670) setCardsToShow(1);
      else if (width < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  /* ================= CLONES ================= */
  const extendedTours =
    tours.length > 0
      ? [...tours.slice(-cardsToShow), ...tours, ...tours.slice(0, cardsToShow)]
      : [];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!tours.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [tours.length]);

  /* ================= MOVE SLIDER ================= */
  useEffect(() => {
    if (!trackRef.current) return;

    const translateValue = (100 / cardsToShow) * currentIndex;

    trackRef.current.style.transition = transition
      ? "transform 0.6s ease"
      : "none";

    trackRef.current.style.transform = `translateX(-${translateValue}%)`;
  }, [currentIndex, cardsToShow, transition]);

  useEffect(() => {
    setCurrentIndex(cardsToShow);
  }, [cardsToShow]);

  /* ================= LOOP FIX ================= */
  const handleTransitionEnd = () => {
    if (currentIndex >= tours.length + cardsToShow) {
      setTransition(false);
      setCurrentIndex(cardsToShow);
    }

    if (currentIndex < cardsToShow) {
      setTransition(false);
      setCurrentIndex(tours.length + cardsToShow - 1);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    });
  };

  const activeDot =
    tours.length > 0
      ? (currentIndex - cardsToShow + tours.length) % tours.length
      : 0;

  return (
    <section className="pt-20 pb-6 bg-white overflow-hidden">

      {/* 👇 Custom Fixed Heading */}
      <SectionHeading>
        San Francisco Premier Exclusive Private Tours
      </SectionHeading>

      <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden">

        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex"
        >
          {extendedTours.map((tour, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3"
              style={{
                width: `${100 / cardsToShow}%`,
              }}
            >
              <TourCard
  image={tour?.tour_thumbnail}
  title={tour?.tour_title}
  description={tour?.tour_top_header}
  reviews={tour?.review_count || Math.floor(Math.random() * 100) + 1}
  rating={tour?.rating || Math.floor(Math.random() * 5) + 1}
  badges={["POPULAR", "RECOMMENDED"]}
  slug={tour?.tour_slug}
  onClick={() => navigate(`/tour/${tour?.tour_slug}`)}
/>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-4 mt-8">
        {tours.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setTransition(true);
              setCurrentIndex(index + cardsToShow);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeDot
                ? "bg-[#3f6f1d] scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-10">
       <PrimaryButton
  variant="large"
  onClick={() =>
    navigate(`/category/${sectionTitle.toLowerCase().replace(/\s+/g, "-")}`)
  }
>
  VIEW ALL
</PrimaryButton>
      </div>
    </section>
  );
}
