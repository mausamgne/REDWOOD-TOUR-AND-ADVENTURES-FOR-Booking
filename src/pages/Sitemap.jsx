import { Link } from "react-router-dom";
import InfoPageLayout from "../components/common/InfoPageLayout";

export default function Sitemap() {
  const links = [
    ["Home", "/"],
    ["About Us", "/about-us"],
    ["Contact Us", "/contact-us"],
    ["Reviews", "/reviews"],
    ["Terms and Conditions", "/terms-and-conditions"],
    ["Privacy Policy", "/privacy-policy"],
    ["FAQs", "/faqs"],
  ];

  return (
    <InfoPageLayout eyebrow="Website Navigation" title="Sitemap">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map(([label, path]) => (
          <Link key={path} to={path} className="border border-green-100 rounded-xl p-5 text-[#2f6417] font-bold hover:bg-green-50">
            {label}
          </Link>
        ))}
      </div>
    </InfoPageLayout>
  );
}