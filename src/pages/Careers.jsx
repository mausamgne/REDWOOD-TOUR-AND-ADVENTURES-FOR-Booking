import InfoPageLayout from "../components/common/InfoPageLayout";

export default function Careers() {
  return (
    <InfoPageLayout
      eyebrow="Join Our Team"
      title="Careers"
      intro="We welcome reliable, friendly, service-minded people who enjoy helping travelers experience Northern California."
    >
      <div className="bg-gray-50 rounded-2xl p-8 text-gray-600 leading-8 text-lg">
        <p>
          If you are interested in tour operations, customer service, driving,
          guiding, or travel coordination, please contact our team with your
          experience and availability.
        </p>
      </div>
    </InfoPageLayout>
  );
}