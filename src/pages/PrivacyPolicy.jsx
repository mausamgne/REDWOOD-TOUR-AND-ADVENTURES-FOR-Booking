import InfoPageLayout from "../components/common/InfoPageLayout";

export default function PrivacyPolicy() {
  return (
    <InfoPageLayout
      eyebrow="Your Information"
      title="Privacy Policy"
      intro="We respect your privacy and use your information only to support your travel inquiry, booking, and customer service needs."
    >
      <div className="space-y-8 text-gray-600 leading-8 text-lg">
        <p>We may collect your name, email, phone number, pickup details, travel date, and message when you contact us or request a booking.</p>
        <p>Your information is used to respond to inquiries, confirm tour details, provide customer support, and improve our services.</p>
        <p>We do not sell your personal information. Limited details may be shared only when required to complete your tour service.</p>
      </div>
    </InfoPageLayout>
  );
}