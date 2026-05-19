import { useEffect, useState, useRef } from "react";
import Heading from "../common/Heading";
import PrimaryButton from "../common/PrimaryButton";
import {useNavigate} from "react-router-dom";

export default function OutdoorSection({ tours = [], sectionTitle = "" }) {
  const navigate = useNavigate();

  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [transition, setTransition] = useState(true);

  const trackRef = useRef(null);

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

  /* ================= CLONE FOR INFINITE ================= */
  const extendedTours =
    tours.length > 0
      ? [...tours.slice(-cardsToShow), ...tours, ...tours.slice(0, cardsToShow)]
      : [];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!tours.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [tours.length]);

  /* ================= SLIDER MOVE ================= */
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

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center">

        {/* Title */}
        <Heading
          as="h2"
          className="text-4xl lg:text-5xl font-bold text-gray-800 mb-20"
        >
          {sectionTitle}
        </Heading>

        {/* Slider */}
        <div className="relative overflow-hidden px-6">
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className="flex"
          >
            {extendedTours.map((tour, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center text-center px-10 h-full"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                {/* Circle Image */}
                <div className="w-56 h-56 rounded-full overflow-hidden shadow-md mb-6">
                  <img
                    src={tour?.circular_thumbnail}
                    alt={tour?.tour_title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-semibold text-[#2e6d1c] mb-4 min-h-[70px] flex items-center justify-center">
                  "{tour?.tour_title}"
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-[300px] min-h-[120px]">
                  {tour?.tour_top_header
                    ? tour.tour_top_header.slice(0, 140) + "..."
                    : ""}
                </p>

                <PrimaryButton
                  onClick={() => navigate(`/tour/${tour?.tour_slug}`)}
                >
                  MORE DETAILS
                </PrimaryButton>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
