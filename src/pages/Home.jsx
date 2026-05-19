import { useOutletContext } from "react-router-dom";

import Hero from "../components/Hero/Hero";
import IntroSection from "../components/sections/introSection";
import RedwoodToursSection from "../components/sections/Redwood";
import AlcatrazToursSection from "../components/sections/AlcatrazToursSection";
import MuirWoodsSection from "../components/sections/MuirWoodsSection";
import SanFranciscoToursSection from "../components/sections/SanFranciscoToursSection";
import YosemiteSection from "../components/sections/YosemiteSection";
import WineSection from "../components/sections/WineSection";
import MontereySection from "../components/sections/MontereySection";
import OutdoorSection from "../components/sections/OutdoorSection";
import ClientTestimonials from "../components/sections/ClientTestimonials";
import QueryCTA from "../components/sections/Query";

export default function Home() {
  const { homepageData } = useOutletContext();

  const homepageInfo = homepageData?.homepage_data?.[0];

  /* ================= TESTIMONIALS ================= */
  const testimonials =
    homepageData?.testimonials ||
    homepageData?.reviews ||
    [];

  const testimonialsHeading =
    homepageData?.testimonials_heading ||
    "Client Testimonials";

  const testimonialsButtonText =
    homepageData?.more_details_button_text ||
    "MORE DETAILS";

  /* ================= REDWOOD ================= */
  const redwoodCategory =
    homepageData?.top_navigation?.find(
      (cat) => String(cat.id) === "42"
    ) || {};

  const redwoodTours = redwoodCategory?.tours || [];

  const redwoodTitle =
    redwoodCategory?.cat_home_page_text ||
    redwoodCategory?.cat_main_title ||
    redwoodCategory?.cat_name ||
    "";

  const redwoodMoreDetailsText =
    redwoodCategory?.more_details_button_text || "MORE DETAILS";

  const redwoodViewAllText =
    redwoodCategory?.view_all_button_text || "VIEW ALL";

  const redwoodPopularText =
    redwoodCategory?.is_popular || "POPULAR";

  const redwoodRecommendedText =
    redwoodCategory?.is_recommended || "RECOMMENDED";

  /* ================= ALCATRAZ ================= */
  const alcatrazCategory =
    homepageData?.top_navigation?.find(
      (cat) => String(cat.id) === "16"
    ) || {};

  const alcatrazTours = alcatrazCategory?.tours || [];

  const alcatrazHeading =
    alcatrazCategory?.cat_home_page_text ||
    alcatrazCategory?.cat_main_title ||
    alcatrazCategory?.cat_name ||
    "";

  const alcatrazMoreDetailsText =
    alcatrazCategory?.more_details_button_text || "MORE DETAILS";

  const alcatrazViewAllText =
    alcatrazCategory?.view_all_button_text || "VIEW ALL";

  const alcatrazPopularText =
    alcatrazCategory?.is_popular || "POPULAR";

  const alcatrazRecommendedText =
    alcatrazCategory?.is_recommended || "RECOMMENDED";

  /* ================= MUIR WOODS ================= */
  const muirCategory =
    homepageData?.top_navigation?.find(
      (cat) => String(cat.id) === "41"
    ) || {};

  const muirWoodsTours = muirCategory?.tours || [];

  const muirHeading =
    muirCategory?.cat_home_page_text ||
    muirCategory?.cat_main_title ||
    muirCategory?.cat_name ||
    "";

  const muirMoreDetailsText =
    muirCategory?.more_details_button_text || "MORE DETAILS";

  const muirViewAllText =
    muirCategory?.view_all_button_text || "VIEW ALL";

  const muirPopularText =
    muirCategory?.is_popular || "POPULAR";

  const muirRecommendedText =
    muirCategory?.is_recommended || "RECOMMENDED";

  /* ================= OTHER SECTIONS ================= */
  const sanFranciscoTours =
    homepageData?.top_navigation?.find((cat) =>
      cat.cat_name?.toLowerCase().includes("san francisco")
    )?.tours || [];

  const wineTours =
    homepageData?.top_navigation?.find((cat) =>
      cat.cat_name?.toLowerCase().includes("wine")
    )?.tours || [];

  const yosemiteTours =
    homepageData?.top_navigation?.find((cat) =>
      cat.cat_name?.toLowerCase().includes("yosemite")
    )?.tours || [];

  const montereyTours =
    homepageData?.top_navigation?.find((cat) =>
      cat.cat_name?.toLowerCase().includes("monterey")
    )?.tours || [];

  const outdoorData = homepageData?.outdoor_tours?.[0];

  const outdoorTours = outdoorData?.tours || [];
  const outdoorTitle =
    outdoorData?.cat_home_page_text ||
    outdoorData?.cat_main_title ||
    outdoorData?.cat_name ||
    "";
const chatLink = homepageInfo?.live_chat_link;
const chatText = homepageInfo?.live_chat_text;
  return (
    <>
      {/* HERO */}
      <Hero data={homepageInfo} />

      {/* INTRO */}
      <IntroSection homepage={homepageInfo} />

      {/* REDWOOD */}
      <RedwoodToursSection
        tours={redwoodTours}
        sectionTitle={redwoodTitle}
        moreDetailsText={redwoodMoreDetailsText}
        viewAllText={redwoodViewAllText}
        popularText={redwoodPopularText}
        recommendedText={redwoodRecommendedText}
      />

      {/* ALCATRAZ */}
      <AlcatrazToursSection
        tours={alcatrazTours}
        sectionTitle={alcatrazHeading}
        moreDetailsText={alcatrazMoreDetailsText}
        viewAllText={alcatrazViewAllText}
        popularText={alcatrazPopularText}
        recommendedText={alcatrazRecommendedText}
      />

      {/* MUIR WOODS */}
      <MuirWoodsSection
        tours={muirWoodsTours}
        sectionTitle={muirHeading}
        moreDetailsText={muirMoreDetailsText}
        viewAllText={muirViewAllText}
        popularText={muirPopularText}
        recommendedText={muirRecommendedText}
      />

      {/* SAN FRANCISCO */}
      <SanFranciscoToursSection tours={sanFranciscoTours} />

      {/* YOSEMITE */}
      <YosemiteSection tours={yosemiteTours} />

      {/* WINE */}
      <WineSection tours={wineTours} />

      {/* MONTEREY */}
      <MontereySection tours={montereyTours} />

      {/* CTA */}
      <QueryCTA
   title="Have a Query?"
   contactNumber={homepageInfo?.contact_number}
   chatLink={chatLink}
   chatText={chatText}
/>

      {/* OUTDOOR */}
      <OutdoorSection
        tours={outdoorTours}
        sectionTitle={outdoorTitle}
      />

      {/* TESTIMONIALS */}
      <ClientTestimonials
        reviews={testimonials}
        heading={testimonialsHeading}
        buttonText={testimonialsButtonText}
      />
    </>
  );
}
