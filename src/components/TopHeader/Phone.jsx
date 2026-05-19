import { Phone } from "lucide-react";

export default function PhoneInfo({ phone }) {

  const formatPhone = (num) => {
  if (!num) return "1-800-210-3008";

  const cleaned = num.replace(/\D/g, "");

  // If 11 digits starting with 1
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `${cleaned[0]}-${cleaned.slice(1,4)}-${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
  }

  // If 10 digits
  if (cleaned.length === 10) {
    return `${cleaned.slice(0,3)}-${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }

  return num;
};


  return (
    <a
      href={phone ? `tel:${phone}` : "#"}
      className="flex items-center gap-3 text-white text-xl md:text-2xl font-semibold tracking-wider cursor-pointer"
    >
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
        <Phone size={20} />
      </div>

      <span>{formatPhone(phone)}</span>
    </a>
  );
}
