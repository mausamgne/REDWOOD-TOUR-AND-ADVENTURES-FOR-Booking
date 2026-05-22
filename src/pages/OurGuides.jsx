import InfoPageLayout from "../components/common/InfoPageLayout";

export default function OurGuides() {
  return (
    <InfoPageLayout
      eyebrow="Travel With Confidence"
      title="Our Guides"
      intro="Our guides and tour team focus on comfort, local knowledge, clear communication, and memorable private travel experiences."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {["Local Knowledge", "Guest Care", "Flexible Planning"].map((item) => (
          <div key={item} className="border border-green-100 rounded-2xl p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-[#2f6417] mb-3">{item}</h3>
            <p className="text-gray-600 leading-7">
              We help guests enjoy each destination with thoughtful timing,
              comfortable routes, and helpful trip support.
            </p>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}