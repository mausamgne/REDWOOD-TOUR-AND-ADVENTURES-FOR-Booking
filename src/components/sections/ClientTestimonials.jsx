import { useEffect, useState, useRef } from "react";
import Heading from "../common/Heading";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClientTestimonials({
  reviews = [],
  heading = "Client Testimonials",
  buttonText = "MORE DETAILS",
}) {
  //   const [reviews, setReviews] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const trackRef = useRef(null);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!reviews.length || reviews.length <= cardsToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + cardsToShow >= reviews.length ? 0 : prev + cardsToShow,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews, cardsToShow]);

  /* ================= MOVE SLIDER ================= */
  useEffect(() => {
    if (!trackRef.current) return;

    trackRef.current.style.transform = `translateX(-${
      (currentIndex * 100) / cardsToShow
    }%)`;
  }, [currentIndex, cardsToShow]);

  /* ================= NAVIGATION ================= */
  const handlePrev = () => {
    if (reviews.length <= cardsToShow) return;

    setCurrentIndex((prev) =>
      prev - cardsToShow < 0
        ? Math.max(reviews.length - cardsToShow, 0)
        : prev - cardsToShow,
    );
  };

  const handleNext = () => {
    if (reviews.length <= cardsToShow) return;

    setCurrentIndex((prev) =>
      prev + cardsToShow >= reviews.length ? 0 : prev + cardsToShow,
    );
  };

  /* ================= SAFE FIELD ACCESS ================= */
  const getImage = (review) => {
    const img = review?.review_image || review?.image || review?.photo || "";

    if (!img) return "";

    return img.startsWith("http")
      ? img
      : `https://redwoodnationalparktours.com${img}`;
  };

  const getName = (review) =>
    review?.reviewer_name || review?.name || review?.title || "";

  const getLocation = (review) =>
    review?.review_location || review?.location || "";

  const getReviewTitle = (review) =>
    review?.review_title || review?.heading || "";

  const getDescription = (review) =>
    review?.review_description || review?.description || review?.review || "";

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center">
        <Heading
          as="h2"
          className="text-4xl lg:text-5xl font-bold text-gray-800 mb-20"
        >
          {heading}
        </Heading>

        <div className="relative overflow-hidden px-6">
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-in-out"
          >
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4"
                  style={{ width: `${100 / cardsToShow}%` }}
                >
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 h-[640px] shadow-sm flex flex-col items-center text-center">
                    {/* IMAGE */}
                    {getImage(review) && (
                      <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-6 bg-gray-100 flex-shrink-0">
                        <img
                          src={getImage(review)}
                          alt={getName(review)}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )}

                    {/* NAME */}
                    <h3 className="text-2xl font-semibold text-[#2e6d1c] min-h-[96px] line-clamp-3">
                      {getName(review)}
                    </h3>

                    {/* LOCATION */}
                    <p className="text-gray-500 mb-3">{getLocation(review)}</p>

                    {/* STARS */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(review?.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className="text-green-600 fill-green-600"
                        />
                      ))}
                    </div>

                    {/* TITLE */}
                    <p className="text-[#2e6d1c] font-semibold text-lg mb-4">
                      "{getReviewTitle(review)}"
                    </p>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 leading-relaxed text-[15px] line-clamp-3 min-h-[90px] mb-6">
                      {review?.review_description ||
                        review?.description ||
                        review?.review ||
                        review?.content ||
                        "Amazing experience with Redwood National Park Tours. Highly recommended for families and private groups!"}
                    </p>
                    <Link
                      to={`/testimonials/${review?.id}`}
                      className="mt-auto bg-[#2e6d1c] text-white px-10 py-4 rounded-full font-semibold inline-block"
                    >
                      {buttonText} →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="w-full text-center text-gray-500">
                No testimonials available.
              </p>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center items-center gap-6 mt-14">
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-full border border-gray-400 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          {/* <Link
  to={`/testimonials/${review?.id}`}
  className="bg-[#2e6d1c] text-white px-10 py-4 rounded-full font-semibold inline-block"
>
  {buttonText} →
</Link> */}

          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full border border-gray-400 flex items-center justify-center"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
