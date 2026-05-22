import InfoPageLayout from "../components/common/InfoPageLayout";

export default function Faqs() {
  const faqs = [
    ["How do I book a tour?", "Choose a tour, open the details page, and follow the booking steps or contact us for help."],
    ["Can I request a custom tour?", "Yes, many private tours can be adjusted based on timing, pickup location, and group needs."],
    ["Do you offer hotel pickup?", "Pickup options depend on your location and selected tour package."],
    ["How do I check availability?", "Send us your tour name, date, and number of guests so our team can confirm availability."],
  ];

  return (
    <InfoPageLayout eyebrow="Helpful Answers" title="FAQs">
      <div className="space-y-5">
        {faqs.map(([q, a]) => (
          <div key={q} className="border border-green-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#2f6417] mb-2">{q}</h3>
            <p className="text-gray-600 leading-7">{a}</p>
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
}