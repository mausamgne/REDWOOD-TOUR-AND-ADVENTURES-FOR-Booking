import { Award, Car, Clock, MapPin, ShieldCheck, Users } from "lucide-react";

export default function AboutUs() {
  const highlights = [
    {
      icon: <MapPin size={28} />,
      title: "Local Tour Knowledge",
      text: "Our tours are built around real Bay Area routes, iconic viewpoints, redwood forests, city landmarks, and comfortable private travel.",
    },
    {
      icon: <Car size={28} />,
      title: "Private Comfortable Travel",
      text: "We focus on private and small-group experiences so guests can enjoy flexible timing, personal attention, and a relaxed pace.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Safe Planning",
      text: "Every trip is planned with guest comfort, pickup timing, route quality, and practical travel needs in mind.",
    },
  ];

  const stats = [
    { value: "2004", label: "Serving travelers since" },
    { value: "5★", label: "Guest-focused experiences" },
    { value: "100%", label: "Private tour planning" },
  ];

  return (
    <section className="bg-white">
      <div className="bg-[#f3f8ef] border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-[#4f772d] font-bold tracking-widest uppercase mb-4">
            About Redwood Tours & Adventures
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Thoughtfully planned private tours across Northern California
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            We help travelers explore Redwood National Park, San Francisco,
            Muir Woods, Alcatraz, Yosemite, Wine Country, Monterey, and nearby
            destinations with comfort, care, and local insight.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2f6417] mb-6">
              Travel should feel personal, not rushed
            </h2>

            <div className="space-y-5 text-gray-600 text-lg leading-8">
              <p>
                Redwood Tours & Adventures was created for guests who want more
                than a standard sightseeing ride. Our goal is to make each tour
                feel smooth, comfortable, and easy to enjoy from pickup to
                drop-off.
              </p>

              <p>
                Whether you are planning a redwood forest escape, a San
                Francisco city day, a Yosemite adventure, or a relaxed Wine
                Country experience, we focus on practical details that make the
                journey better.
              </p>

              <p>
                We believe good tours come from good planning: clear routes,
                friendly service, flexible timing, and helpful communication.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#2f6417] p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-6">
              What we care about
            </h3>

            <ul className="space-y-5">
              <li className="flex gap-4">
                <Clock className="mt-1 flex-shrink-0" />
                <span>On-time pickup and organized tour flow</span>
              </li>
              <li className="flex gap-4">
                <Users className="mt-1 flex-shrink-0" />
                <span>Friendly communication before and during your trip</span>
              </li>
              <li className="flex gap-4">
                <Award className="mt-1 flex-shrink-0" />
                <span>Memorable experiences built around guest comfort</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="border border-green-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="w-14 h-14 rounded-full bg-[#edf7e8] text-[#2f6417] flex items-center justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-extrabold text-[#2f6417]">
                {stat.value}
              </div>
              <p className="mt-2 text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}