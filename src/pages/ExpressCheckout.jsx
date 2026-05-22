import InfoPageLayout from "../components/common/InfoPageLayout";

export default function ExpressCheckout() {
  return (
    <InfoPageLayout
      eyebrow="Fast Booking"
      title="Express Checkout"
      intro="Use express checkout when you already know your preferred tour, date, pickup location, and group size."
    >
      <div className="bg-gray-50 rounded-2xl p-8 text-gray-600 leading-8 text-lg">
        <p>
          To complete a fast booking, please prepare your tour name, travel date,
          number of guests, contact details, and pickup information.
        </p>
      </div>
    </InfoPageLayout>
  );
}