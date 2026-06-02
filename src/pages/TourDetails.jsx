import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../components/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TourDetails() {
  const { tourSlug } = useParams();

  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rateDate, setRateDate] = useState("");
  const [rateGuests, setRateGuests] = useState(1);
  const [rateVehicle, setRateVehicle] = useState(null);
  const [cartAdded, setCartAdded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hotelIncluded, setHotelIncluded] = useState(true);
  const [maxGuests, setMaxGuests] = useState(0);
  {
    /* Hotel */
  }
  <div>
    <label className="block text-sm mb-2 font-semibold">Hotel Included</label>

    <div
      onClick={() => setHotelIncluded((prev) => !prev)}
      className="cursor-pointer bg-[#efefef] px-4 py-3 rounded-md flex items-center justify-between
               border-2 border-primary"
    >
      <span
        className={`font-medium ${
          hotelIncluded ? "text-green-600" : "text-gray-500"
        }`}
      >
        {hotelIncluded ? "Yes" : "No"}
      </span>

      <div
        className={`w-12 h-6 rounded-full relative transition-all duration-300
        ${hotelIncluded ? "bg-primary" : "bg-gray-400"}`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300
          ${hotelIncluded ? "right-0.5" : "left-0.5"}`}
        ></div>
      </div>
    </div>
  </div>;
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!tourSlug) return;

    fetch(
      `https://adminzwy8.redwoodnationalparktours.com/api/get_tourdetails?tour_slug=${tourSlug}&lang_id=1&website_id=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.tour_details) {
          const details = data.tour_details;
          setTourData(details);
          setSelectedVehicle(details.tourprices?.[0]);
        } else {
          setTourData(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tourSlug]);

  /* ================= SLIDER IMAGES ================= */
  const sliderImages =
    tourData?.toursliderimages?.length > 0
      ? tourData.toursliderimages.map(
          (img) =>
            `https://redwoodnationalparktours.com/public/images/${img.slider_alt_text}`,
        )
      : tourData?.tour_pic
        ? [tourData.tour_pic]
        : [];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!sliderImages.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [sliderImages]);

  const nextSlide = () => {
    if (!sliderImages.length) return;
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    if (!sliderImages.length) return;
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  /* ================= CORRECT PRICE LOGIC ================= */

  let pricePerGuest = 0;
  let totalPrice = 0;

  if (selectedVehicle?.allpricerange?.length) {
    const matchedRange = selectedVehicle.allpricerange.find((range) => {
      const from = Number(range.seats_from);
      const to = Number(range.seats_to);
      return guestCount >= from && guestCount <= to;
    });

    if (matchedRange) {
      const basePrice = Number(matchedRange.price || 0);

      const isSUV = selectedVehicle.vehicle_name === "SUV";

      if (isSUV) {
        pricePerGuest = basePrice;
        totalPrice = basePrice * guestCount;
      } else {
        pricePerGuest = basePrice;
        totalPrice = basePrice;
      }
    }
  }
  // const totalPrice = pricePerGuest * guestCount;

  const variables = tourData?.tour_variables;
  const limitedDates = tourData?.calendarlimiteddates || [];
  const soldDates = tourData?.calendarsolddates || [];

  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   return d.toISOString().split("T")[0];
  // };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ================= RATES TAB TOTAL ================= */

  let rateTotal = 0;

  if (rateVehicle?.allpricerange?.length) {
    const matchedRange = rateVehicle.allpricerange.find((range) => {
      const from = Number(range.seats_from);
      const to = Number(range.seats_to);
      return rateGuests >= from && rateGuests <= to;
    });

    if (matchedRange) {
      const basePrice = Number(matchedRange.price || 0);

      const isPerPerson = rateVehicle.vehicle_name === "SUV";

      rateTotal = isPerPerson ? basePrice * rateGuests : basePrice;
    }
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* ================= HERO SLIDER ================= */}
      <div className="relative w-full h-[220px] sm:h-[360px] md:h-[500px] overflow-hidden">
        {sliderImages.length > 0 && (
          <img
            src={sliderImages[currentSlide]}
            alt="Tour Slide"
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
        )}

        {/* LEFT ARROW */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 
    bg-green-600/90 hover:bg-green-700 text-white 
    p-2 sm:p-3 rounded-full shadow-md transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 
    bg-green-600/90 hover:bg-green-700 text-white 
    p-2 sm:p-3 rounded-full shadow-md transition"
        >
          <ChevronRight size={20} />
        </button>

        {/* DOTS */}
        <div
          className="absolute bottom-3 sm:bottom-5 md:bottom-6 
  left-1/2 -translate-x-1/2 flex gap-2"
        >
          {sliderImages.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer transition
        ${currentSlide === index ? "bg-green-500 scale-110" : "bg-white/80"}`}
            />
          ))}
        </div>
      </div>

      {/* ================= BOOKING BAR ================= */}
      <div className="bg-[#6a3a2a] text-white py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            {/* Pickup Date */}
            <div>
              <label className="block text-sm mb-2 font-semibold">
                {tourData?.cartform_pickupdate_text || "Select Pickup Date"}
              </label>
              <input
                readOnly
                value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                placeholder="Select Date"
                onClick={() => setShowCalendar(true)}
                className="w-full bg-[#efefef] text-black px-4 py-3 rounded-md cursor-pointer"
              />
            </div>

            {/* ================= VEHICLE SELECT ================= */}
            <div>
              <label className="block text-sm mb-2 font-semibold text-white">
                Select a Vehicle
              </label>

              <select
                value={selectedVehicle?.id ?? ""}
                onChange={(e) => {
                  const vehicleId = Number(e.target.value);

                  const vehicle = tourData?.tourprices?.find(
                    (v) => v.id === vehicleId,
                  );

                  if (!vehicle) {
                    setSelectedVehicle(null);
                    setGuestCount(1);
                    return;
                  }

                  setSelectedVehicle(vehicle);

                  // ✅ Ensure proper number
                  const max = Number(vehicle.max_passengers) || 7;

                  setGuestCount(1);
                }}
                className="w-full bg-white text-black px-4 py-3 rounded-md 
               border-2 border-green-700 
               focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select Vehicle</option>

                {tourData?.tourprices?.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicle_name} (Max {vehicle.max_passengers} Guests)
                  </option>
                ))}
              </select>
            </div>

            {/* ================= SELECT NO OF GUESTS ================= */}
            <div className="mt-6">
              <label className="block text-sm mb-2 font-semibold text-white">
                Select No of Guests
              </label>

              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                disabled={!selectedVehicle}
                className="w-full bg-white text-black px-4 py-3 rounded-md 
               border-2 border-green-700 
               focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {selectedVehicle &&
                  Array.from(
                    {
                      length: Number(selectedVehicle?.max_passengers) || 7,
                    },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? "s" : ""}
                      </option>
                    ),
                  )}
              </select>
            </div>

            {/* Hotel Included - Always Yes */}
            <div>
              <label className="block text-sm mb-2 font-semibold">
                Hotel Included
              </label>

              <div
                className="bg-[#efefef] px-4 py-3 rounded-md flex items-center justify-between
               border-2 border-primary"
              >
                <span className="font-medium text-green-600">Yes</span>

                <div className="w-12 h-6 rounded-full relative bg-primary">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
            </div>
            {/* TOTAL + BUTTON */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* TOTAL DISPLAY */}
              <div>
                <div className="text-sm font-medium mb-1">
                  {tourData?.cartform_total_text || "Total USD"}
                </div>
                <div className="text-3xl font-bold">
                  ${Number(totalPrice || 0).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!selectedDate) {
                    alert("Please choose a date first.");
                    return;
                  }

                  if (!selectedVehicle) {
                    alert("Please select a vehicle.");
                    return;
                  }

                  if (!guestCount || guestCount < 1) {
                    alert("Please select number of guests.");
                    return;
                  }

                  //                   const guests = Number(guestCount);

                  // const matchedRange = selectedVehicle?.allpricerange?.find(
                  //   (range) =>
                  //     guests >= Number(range.seats_from) &&
                  //     guests <= Number(range.seats_to)
                  // );

                  const guests = Number(guestCount);

                  const matchedRange = selectedVehicle?.allpricerange?.find(
                    (range) =>
                      guests >= Number(range.seats_from) &&
                      guests <= Number(range.seats_to),
                  );

                  let pricePerPerson = 0;
                  let total = 0;

                  if (matchedRange) {
                    const base = Number(matchedRange.price || 0);

                    if (selectedVehicle.vehicle_name === "SUV") {
                      // ✅ SUV → per person pricing
                      pricePerPerson = base;
                      total = base * guests;
                    } else {
                      // ✅ VAN → fixed pricing (slab based)
                      pricePerPerson = base;
                      total = base;
                    }
                  }

                  const bookingDate = formatDate(selectedDate);

                  const tourItem = {
                    id: Date.now(),
                    title: tourData?.tour_title?.trim(),
                    quantity: guests,
                    travelDate: bookingDate,
                    date: bookingDate,
                    vehicle: selectedVehicle,
                    price: pricePerPerson,
                    total: total,
                  };

                  // ✅ CHECK DUPLICATE BOOKING
                  // ✅ GET PREVIOUS PLACED ORDERS
                  const previousOrders =
                    JSON.parse(localStorage.getItem("placedOrders")) || [];

                  // ✅ CHECK DUPLICATE FROM PREVIOUS ORDERS
                  const alreadyBooked = previousOrders.some((order) => {
                    const savedTitle = order.title?.trim().toLowerCase();

                    const currentTitle = tourItem.title?.trim().toLowerCase();

                    const savedDate = order.travelDate || order.date;

                    const currentDate = tourItem.travelDate;

                    return (
                      savedTitle === currentTitle && savedDate === currentDate
                    );
                  });

                  // ❌ BLOCK SAME TOUR + SAME DATE
                  if (alreadyBooked) {
                    toast.error("You already booked this tour for this date.");

                    return;
                  }

                  // ✅ ADD TO CART
                  addToCart(tourItem);

                  navigate("/cart");
                }}
               
  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold whitespace-nowrap"
>
 
                Confirm Booking
              </button>
            </div>

            {/* ================= CALENDAR MODAL ================= */}
            {showCalendar && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="w-[500px] bg-[#e9e9e9] rounded-lg shadow-2xl overflow-hidden relative">
                  {/* TOP STATUS BAR */}
                  <div className="flex text-white text-center font-semibold text-sm">
                    <div className="flex-1 bg-green-500 py-2">Available</div>
                    <div className="flex-1 bg-yellow-400 py-2 text-black">
                      Limited
                    </div>
                    <div className="flex-1 bg-red-500 py-2">Sold Out</div>
                  </div>

                  {/* MONTH HEADER */}
                  <div className="bg-[#2f4b82] text-white text-center py-4 relative">
                    <h2 className="text-2xl font-bold">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>

                    <button
                      onClick={() => changeMonth(1)}
                      className="absolute right-4 top-4 text-xl"
                    >
                      ➤
                    </button>
                  </div>

                  {/* YEAR DROPDOWN */}
                  <div className="flex justify-center py-4">
                    <select
                      value={currentMonth.getFullYear()}
                      onChange={(e) => {
                        const newDate = new Date(currentMonth);
                        newDate.setFullYear(e.target.value);
                        setCurrentMonth(newDate);
                      }}
                      className="border-2 border-yellow-500 px-4 py-2 bg-white text-black"
                    >
                      {Array.from({ length: 20 }, (_, i) => 2026 + i).map(
                        (year) => (
                          <option key={year}>{year}</option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* WEEK DAYS */}
                  <div className="grid grid-cols-7 gap-2 px-4 pb-2 text-center font-semibold">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="bg-sky-400 py-2 rounded text-black"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* ================= DATES GRID ================= */}
                  <div className="grid grid-cols-7 gap-2 px-4 pb-6">
                    {Array.from({
                      length: getFirstDayOfMonth(currentMonth),
                    }).map((_, i) => (
                      <div key={i}></div>
                    ))}

                    {Array.from({ length: getDaysInMonth(currentMonth) }).map(
                      (_, index) => {
                        const day = index + 1;

                        const fullDate = new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day,
                        );

                        // 🟢 Today's Date
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // 🟢 Minimum allowed date = Tomorrow
                        const minSelectableDate = new Date(today);
                        minSelectableDate.setDate(today.getDate() + 1);

                        // 🔴 Disable if date < tomorrow
                        const isDisabled = fullDate < minSelectableDate;

                        const isSelected =
                          selectedDate &&
                          selectedDate.toDateString() ===
                            fullDate.toDateString();

                        return (
                          <div
                            key={day}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedDate(fullDate);
                                setShowCalendar(false);
                              }
                            }}
                            className={`py-3 text-center rounded font-semibold
            ${
              isDisabled
                ? "bg-[#8B4513] text-white cursor-not-allowed opacity-70"
                : isSelected
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700 border border-green-500 cursor-pointer hover:bg-green-200"
            }
          `}
                          >
                            {day}
                          </div>
                        );
                      },
                    )}
                  </div>
                  {/* FOOTER TEXT */}
                  <div className="text-center font-semibold pb-4 text-black">
                    *Select a date from calendar
                  </div>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="absolute bottom-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 text-xl"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= HERO HEADING SECTION ================= */}
      {tourData?.tour_heading_for_tour_landing_page && (
        <div className="bg-[#f4f4f4] py-16">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <div
              className="ck-content text-center"
              dangerouslySetInnerHTML={{
                __html: tourData.tour_heading_for_tour_landing_page,
              }}
            />
          </div>
        </div>
      )}

      {/* ================= TAB BUTTONS ================= */}
      <div className="flex flex-wrap justify-center gap-2 py-4 sm:gap-3 px-4 ">
        {/* FIRST ROW */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            {
              key: "overview",
              label: variables?.tourtabs_overview_text || "Overview",
            },
            {
              key: "description",
              label: variables?.tourtabs_description_text || "Description",
            },
            {
              key: "itinerary",
              label: variables?.tourtabs_itinerary_text || "Itinerary",
            },
            { key: "rates", label: variables?.tourtabs_rates_text || "Rates" },
            {
              key: "cancel",
              label:
                variables?.tourtabs_canclerefund_text ||
                "Cancellation & Refund Policy",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 text-sm font-semibold rounded-md border transition-all duration-300
          ${
            activeTab === tab.key
              ? "bg-white text-[#25660a] border-[#25660a] shadow-md"
              : "bg-[#25660a] text-white border-[#25660a] hover:bg-[#2f6f0d]"
          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECOND ROW */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            {
              key: "reviews",
              label: variables?.tourtabs_review_text || "Reviews",
            },
            {
              key: "images",
              label: variables?.tourtabs_image_text || "Images",
            },
            {
              key: "videos",
              label: variables?.tourtabs_video_text || "Videos",
            },
            { key: "faq", label: variables?.faq_tab_text || "Faqs" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 text-sm font-semibold rounded-md border transition-all duration-300
          ${
            activeTab === tab.key
              ? "bg-white text-[#25660a] border-[#25660a] shadow-md"
              : "bg-[#25660a] text-white border-[#25660a] hover:bg-[#2f6f0d]"
          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB CONTENT ================= */}

        {activeTab === "overview" && (
          <div className="max-w-[1100px] mx-auto px-6 py-8">
            <div
              className="ck-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: tourData?.tour_overview,
              }}
            />
          </div>
        )}

        {activeTab === "description" && (
          <div className="max-w-[1100px] mx-auto px-6 py-10">
            <div
              className="ck-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: tourData?.tour_description,
              }}
            />
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="bg-[#f9f9f9] py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#2f5e1a]">
                Tour Itinerary
              </h2>

              <div
                className="ck-content text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: tourData?.tour_itinerary,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "rates" && (
          <div className="max-w-[1200px] mx-auto px-6 py-10">
            {/* Description */}
            <div
              className="ck-content text-center mb-12"
              dangerouslySetInnerHTML={{
                __html: tourData?.tour_price_description,
              }}
            />

            {tourData?.tourprices?.map((vehicle) => {
              const isSUV = vehicle.name === "SUV";

              return (
                <div key={vehicle.id} className="mb-20">
                  {/* 👉 PASTE YOUR NEW DESIGN HERE */}

                  <div className="max-w-[1400px] mx-auto mb-16">
                    <div className="border-[6px] border-black rounded-2xl overflow-hidden shadow-2xl bg-black">
                      {/* ================= GREEN HEADER ================= */}
                      <div className="relative bg-[#4b6f2a] py-12 flex items-center justify-center">
                        {/* TITLE */}
                        <h2 className="text-white text-5xl font-semibold tracking-wide text-center">
                          Private Tour by Luxury {vehicle.name}
                        </h2>
                      </div>

                      {/* ================= BLACK STRIP ================= */}
                      <div className="relative bg-black py-6 flex items-center justify-center">
                        {/* LEFT DIAMOND */}
                        <div className="absolute left-8 w-4 h-4 bg-yellow-400 rotate-45"></div>

                        {/* CENTER STARS */}
                        <div className="text-yellow-400 text-3xl tracking-widest">
                          ★★★★★
                        </div>

                        {/* RIGHT DIAMOND */}
                        <div className="absolute right-8 w-4 h-4 bg-yellow-400 rotate-45"></div>
                      </div>

                      {/* ================= IMAGE GRID ================= */}
                      <div className="bg-black px-6 pb-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          {tourData?.tourgalleryimages
                            ?.slice(0, 3)
                            .map((img) => (
                              <img
                                key={img.image_id}
                                src={img.gallery_image}
                                alt={img.gallery_alt_text}
                                className="w-full h-[320px] object-cover rounded-lg"
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOOKING CONTROLS */}
                  <div className="bg-gray-100 px-8 py-8 rounded-b-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "faq" && (
          <div className="bg-white py-12">
            <div className="max-w-[1100px] mx-auto px-6">
              <div
                className="ck-content text-gray-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: tourData?.faq,
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-[#f9f9f9] py-20">
            <div className="max-w-[1200px] mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-16 text-[#2f5e1a]">
                What Our Guests Say
              </h2>

              {tourData?.ourtestimonials?.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {tourData.ourtestimonials.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
                    >
                      <div className="flex justify-center mb-6">
                        <img
                          src={item.image}
                          alt={item.alt_image_text}
                          className="w-24 h-24 rounded-full object-cover border-4 border-[#3e6b1f]"
                        />
                      </div>

                      <h3 className="text-xl font-semibold text-center text-[#2f5e1a] mb-2">
                        {item.title}
                      </h3>

                      <p className="text-center text-sm text-gray-500 mb-4">
                        {item.comment_added_by} – {item.author_country}
                      </p>

                      <div className="text-center text-yellow-400 text-lg mb-4">
                        ★★★★★
                      </div>

                      <div
                        className="text-gray-600 text-sm leading-relaxed text-center"
                        dangerouslySetInnerHTML={{ __html: item.comment }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  No Reviews Available
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "images" && (
          <div className="grid md:grid-cols-3 gap-6">
            {tourData?.tourgalleryimages?.map((img) => (
              <img
                key={img.image_id}
                src={img.gallery_image}
                alt={img.gallery_alt_text}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="grid md:grid-cols-2 gap-6">
            {tourData?.tourvideogallery?.map((video) => (
              <iframe
                key={video.id}
                src={video.video_link.replace("watch?v=", "embed/")}
                className="w-full h-[300px] rounded-lg"
                allowFullScreen
              />
            ))}
          </div>
        )}
        {activeTab === "cancel" && (
          <div className="bg-white py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              {/* BIG HEADING */}
              <h2 className="text-center text-4xl md:text-5xl font-serif text-[#2f4f1f] mb-6">
                REDWOODS TOURS TERMS AND CONDITIONS INCLUDING
              </h2>

              <h3 className="text-center text-3xl md:text-4xl font-serif text-[#2f4f1f] mb-10">
                CANCEL & REFUND POLICY
              </h3>

              <div className="border-b border-gray-300 mb-12"></div>

              {/* API CONTENT */}
              <div
                className="ck-content text-gray-800 leading-8 space-y-6"
                dangerouslySetInnerHTML={{
                  __html: tourData?.cancel_rate_policy_text,
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div />
    </div>
  );
}
