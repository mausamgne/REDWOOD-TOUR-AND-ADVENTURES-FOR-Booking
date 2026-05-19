import { useEffect, useState } from "react";
// import Link from "../common/Link";
import Heading from "../common/Heading";
import Text from "../common/Text";
import FooterBottomNav from "./FooterBot";
import { MessageCircle, ShoppingCart } from "lucide-react";
import LiveChatButton from "../TopHeader/LiveChat";
import { Link } from "react-router-dom";

export default function Footer({ homepageData }) {
  // const [homepageData, setHomepageData] = useState(null);
  const [activeQuick, setActiveQuick] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const quickLinks = homepageData.quick_links || [];
  const socialLinks = homepageData.footer_social_links || [];
  const whySection = homepageData.why_choose_us?.[0];
  const whyPoints = whySection?.footerheadercontent || [];

  return (
    <footer className="bg-gradient-to-r from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] text-gray-400">
      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-20 grid grid-cols-2 md:grid-cols-3 gap-16">
        {/* QUICK LINKS */}
        <div>
          <Heading className="text-[#17c964] text-3xl font-semibold mb-6">
            {homepageData.quick_links_title || "Quick Links"}
          </Heading>

          <ul className="space-y-3 text-base">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/${link.page_slug}`}
                  onClick={() => setActiveQuick(link.id)}
                >
                  <Text
                    className={`transition duration-300 cursor-pointer ${
                      activeQuick === link.id
                        ? "text-grey-400"
                        : "hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>

          {/* LIVE CHAT */}
          <LiveChatButton
            chatLink={
              homepageData?.chat_button_link ||
              "https://livehelpnow.net/lhn/lcv.aspx?d=0"
            }
            chatText={homepageData?.chat_button_text || "Live Chat"}
          />

          {/* ORDER NOW */}
          <button
            onClick={() => setActiveButton("order")}
            className={`mt-4  flex items-center justify-between px-4 py-4 rounded-lg border transition ${
              activeButton === "order"
                ? "bg-[#5e8e3e] text-white border-[#5e8e3e]"
                : "border-gray-600 hover:border-[#5e8e3e]"
            }`}
          >
            <span className="text-lg font-semibold">
              {homepageData.order_now_button_text || "Order Now"}
            </span>
            <ShoppingCart size={22} />
          </button>
        </div>

        {/* FOLLOW US */}
        <div>
          <Heading className="text-[#17c964] text-3xl font-semibold mb-6">
            {homepageData.social_heading || "Follow Us"}
          </Heading>

          <ul className="space-y-4 text-base">
            {socialLinks.map((social) => (
              <li key={social.id}>
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {social.title}
                </a>
              </li>
            ))}
          </ul>

          {homepageData.login_button_text && (
            <Link href={`/${homepageData.login_button_slug || ""}`}>
              <button className="mt-8 px-8 py-3 rounded-lg border border-gray-600 hover:border-[#5e8e3e] text-white transition">
                {homepageData.login_button_text}
              </button>
            </Link>
          )}
        </div>

        {/* WHY CHOOSE US */}
        <div className="w-full">
          <Heading className="text-[#17c964] text-3xl font-semibold mb-6 flex-nowrap">
            {whySection?.title || "Why Choose Us?"}
          </Heading>

          <ul className="space-y-5">
            {whyPoints.map((point) => (
              <li key={point.id} className="flex gap-4 items-start">
                <span className="text-gray-300 text-lg mt-1">→</span>
                <Text className=" w-full leading-relaxed text-sm text-gray-400">
                  {point.description}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* BIG BANNER IMAGE */}
      {homepageData?.footer_image && (
        <div className="w-full">
          <img
            src={homepageData.footer_image}
            alt={homepageData.footer_img_alt_text || "Footer Banner"}
            className="w-full h-[450px] object-cover"
          />
        </div>
      )}

      {/* BOTTOM NAV */}
      <FooterBottomNav tours={homepageData.footer_navigation || []} />

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        {homepageData.footer_copyright_content}
      </div>
    </footer>
  );
}
