import InfoPageLayout from "../components/common/InfoPageLayout";

export default function FleetPage() {
  return (
    <InfoPageLayout
      eyebrow="Comfortable Travel"
      title="Fleet Page"
      intro="Our private tours are planned with comfortable vehicles suitable for families, couples, and small groups."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {["Private SUVs", "Comfort Vans", "Group Vehicles"].map((item) => (
          <div key={item} className="border border-green-100 rounded-2xl p-7 shadow-sm">
            <h3 className="text-2xl font-bold text-[#2f6417] mb-3">{item}</h3>
            <p className="text-gray-600 leading-7">
              Vehicle options depend on group size, route, and tour availability.
            </p>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}