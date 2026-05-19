import { useEffect, useState } from "react";

export default function TestimonialsPage() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    window.scrollTo(0, 0);

    fetch(
      "https://adminzwy8.redwoodnationalparktours.com/api/get_homepage?lang_id=1&website_id=1"
    )
      .then((res) => res.json())
      .then((data) => {

        console.log("API DATA:", data);

        // ✅ GET TESTIMONIALS
        const testimonials = data?.testimonials || [];

        console.log("TESTIMONIALS:", testimonials);

        // ✅ SET REVIEWS
        setReviews(testimonials);

        setLoading(false);

      })
      .catch((err) => {

        console.log("API ERROR:", err);

        setLoading(false);

      });

  }, []);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="py-32 text-center text-4xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <>

      {/* HERO SECTION */}
      <section className="relative w-full h-[750px] overflow-hidden">

        <img
          src="https://redwoodnationalparktours.com/public/images/image_banner.webp"
          alt="Testimonials Banner"
          className="w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20"></div>

      </section>

      {/* CONTENT */}
      <section className="bg-white py-20 px-6">

        <div className="max-w-[1200px] mx-auto">

          {/* PAGE TITLE */}
          <h1 className="text-center text-2xl lg:text-3xl font-bold text-[#3f6f1d] mb-24 leading-[80px]">
            - TRAVELERS’ TESTIMONIALS / DESTINATIONS -
          </h1>

          {/* TESTIMONIALS */}
          <div className="space-y-1">

            {reviews.length > 0 ? (

              reviews.map((review, index) => (

                <div
                  key={index}
                  className="border-b border-gray-200 pb-20"
                >

                  {/* TITLE */}
                  <h2 className="text-center text-3xl lg:text-2xl font-bold text-[#3f6f1d] leading-[70px] mb-10">

                    {review?.title || "Client Testimonial"}

                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-lg lg:text-xl leading-[45px] text-gray-700 text-center">

                    {review?.comment ||
                      "Amazing experience with Redwood National Park Tours."}

                  </p>

                  {/* AUTHOR */}
                  {review?.comment_added_by && (
                    <p className="text-center text-[#3f6f1d] font-semibold mt-8 text-md">
                      — {review?.comment_added_by}
                    </p>
                  )}

                </div>

              ))

            ) : (

              <div className="text-center text-3xl font-semibold py-20">
                No testimonials found
              </div>

            )}

          </div>

        </div>

      </section>

    </>
  );
}