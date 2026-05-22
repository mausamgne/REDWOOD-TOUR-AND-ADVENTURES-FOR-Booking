import InfoPageLayout from "../components/common/InfoPageLayout";

export default function TermsConditions() {
  return (
    <InfoPageLayout
      eyebrow="Booking Information"
      title="Terms and Conditions"
      intro="Please review these terms before booking a tour with Redwood Tours & Adventures."
    >
      <div className="space-y-8 text-gray-600 leading-8 text-lg">
        <p>All tour bookings are subject to availability, route conditions, pickup location, and final confirmation from our team.</p>
        <p>Guests are responsible for providing accurate contact details, pickup information, travel dates, and number of passengers.</p>
        <p>Tour timing may vary due to traffic, weather, park access, road closures, or other travel conditions outside our control.</p>
        <p>Cancellation, refund, and rescheduling requests are reviewed according to the selected tour package and notice period.</p>
      </div>
    </InfoPageLayout>
  );
}