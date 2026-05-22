import { Mail, MapPin, Phone } from "lucide-react";
import InfoPageLayout from "../components/common/InfoPageLayout";

export default function ContactUs() {
  return (
    <InfoPageLayout
      eyebrow="Contact Redwood Tours"
      title="Contact Us"
      intro="Have a question about a tour, pickup, booking, or custom itinerary? Our team is here to help you plan a smooth trip."
    >
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-green-100 rounded-2xl p-7 shadow-sm">
          <Phone className="text-[#2f6417] mb-4" size={34} />
          <h3 className="text-xl font-bold mb-2">Call Us</h3>
          <p className="text-gray-600">1-800-210-3008</p>
        </div>

        <div className="border border-green-100 rounded-2xl p-7 shadow-sm">
          <Mail className="text-[#2f6417] mb-4" size={34} />
          <h3 className="text-xl font-bold mb-2">Email Us</h3>
          <p className="text-gray-600">support@redwoodtours.com</p>
        </div>

        <div className="border border-green-100 rounded-2xl p-7 shadow-sm">
          <MapPin className="text-[#2f6417] mb-4" size={34} />
          <h3 className="text-xl font-bold mb-2">Location</h3>
          <p className="text-gray-600">San Francisco, California</p>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-[#2f6417] mb-4">
          Send us your tour request
        </h2>
        <p className="text-gray-600 leading-8">
          Please include your preferred tour, travel date, number of guests,
          hotel location, and any special requests. We will review your message
          and respond as soon as possible.
        </p>
      </div>
    </InfoPageLayout>
  );
}