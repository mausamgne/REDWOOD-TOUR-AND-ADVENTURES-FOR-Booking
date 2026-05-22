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
  const sanFranciscoCategory =
  homepageData?.top_navigation?.find((cat) =>
    cat.cat_name?.toLowerCase().includes("san francisco")
  ) || {};

const sanFranciscoTours = sanFranciscoCategory?.tours || [];

const sanFranciscoHeading =
  sanFranciscoCategory?.cat_home_page_text ||
  sanFranciscoCategory?.cat_main_title ||
  sanFranciscoCategory?.cat_name ||
  "San Francisco Premier Exclusive Private Tours";

const sanFranciscoViewAllText =
  sanFranciscoCategory?.view_all_button_text || "VIEW ALL";

  const wineCategory =
  homepageData?.top_navigation?.find((cat) =>
    cat.cat_name?.toLowerCase().includes("wine")
  ) || {};

const wineTours = wineCategory?.tours || [];

const wineHeading =
  wineCategory?.cat_home_page_text ||
  wineCategory?.cat_main_title ||
  wineCategory?.cat_name ||
  "Wine Country Tours";

const wineMoreDetailsText =
  wineCategory?.more_details_button_text || "MORE DETAILS";

const wineViewAllText =
  wineCategory?.view_all_button_text || "VIEW ALL";

const winePopularText =
  wineCategory?.is_popular || "POPULAR";

const wineRecommendedText =
  wineCategory?.is_recommended || "RECOMMENDED";
    

  const yosemiteCategory =
  homepageData?.top_navigation?.find((cat) =>
    cat.cat_name?.toLowerCase().includes("yosemite")
  ) || {};

const yosemiteTours = yosemiteCategory?.tours || [];

const yosemiteHeading =
  yosemiteCategory?.cat_home_page_text ||
  yosemiteCategory?.cat_main_title ||
  yosemiteCategory?.cat_name ||
  "Yosemite Tours";

const yosemiteViewAllText =
  yosemiteCategory?.view_all_button_text || "VIEW ALL";

  const montereyCategory =
  homepageData?.top_navigation?.find((cat) =>
    cat.cat_name?.toLowerCase().includes("monterey")
  ) || {};

const montereyTours = montereyCategory?.tours || [];

const montereyHeading =
  montereyCategory?.cat_home_page_text ||
  montereyCategory?.cat_main_title ||
  montereyCategory?.cat_name ||
  "Monterey Tours";

const montereyMoreDetailsText =
  montereyCategory?.more_details_button_text || "MORE DETAILS";

const montereyViewAllText =
  montereyCategory?.view_all_button_text || "VIEW ALL";

const montereyPopularText =
  montereyCategory?.is_popular || "POPULAR";

const montereyRecommendedText =
  montereyCategory?.is_recommended || "RECOMMENDED";

  const outdoorData = homepageData?.outdoor_tours?.[0];

  const outdoorTours = outdoorData?.tours || [];
  const outdoorTitle =
    outdoorData?.cat_home_page_text ||
    outdoorData?.cat_main_title ||
    outdoorData?.cat_name ||
    "";
const chatLink = homepageInfo?.chat_button_link;
const chatText = homepageInfo?.chat_button_text;
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
  categorySlug={
    redwoodCategory?.cat_slug ||
    redwoodCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
    "redwood"
  }
  moreDetailsText={redwoodMoreDetailsText}
  viewAllText={redwoodViewAllText}
  popularText={redwoodPopularText}
  recommendedText={redwoodRecommendedText}
/>

      {/* ALCATRAZ */}
      <AlcatrazToursSection
  tours={alcatrazTours}
  sectionTitle={alcatrazHeading}
  categorySlug={
    alcatrazCategory?.cat_slug ||
    alcatrazCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
    "alcatraz"
  }
  moreDetailsText={alcatrazMoreDetailsText}
  viewAllText={alcatrazViewAllText}
  popularText={alcatrazPopularText}
  recommendedText={alcatrazRecommendedText}
/>

      {/* MUIR WOODS */}
      <MuirWoodsSection
  tours={muirWoodsTours}
  sectionTitle={muirHeading}
  categorySlug={
    muirCategory?.cat_slug ||
    muirCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
    "muir-woods"
  }
  moreDetailsText={muirMoreDetailsText}
  viewAllText={muirViewAllText}
  popularText={muirPopularText}
  recommendedText={muirRecommendedText}
/>

      {/* SAN FRANCISCO */}
      <SanFranciscoToursSection
  tours={sanFranciscoTours}
  sectionTitle={sanFranciscoHeading}
  categorySlug={
    sanFranciscoCategory?.cat_slug ||
    sanFranciscoCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
    "san-francisco"
  }
  viewAllText={sanFranciscoViewAllText}
/>

      {/* YOSEMITE */}
      <YosemiteSection
  tours={yosemiteTours}
  sectionTitle={yosemiteHeading}
  categorySlug={
    yosemiteCategory?.cat_slug ||
    yosemiteCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
    "yosemite"
  }
  viewAllText={yosemiteViewAllText}
/>

      {/* WINE */}
      <WineSection tours={wineTours} 
      sectionTitle={wineHeading}
      categorySlug={
        wineCategory?.cat_slug ||
        wineCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
        "wine"
      }
      moreDetailsText={wineMoreDetailsText}
      viewAllText={wineViewAllText}
      popularText={winePopularText}
      recommendedText={wineRecommendedText}
    />

      {/* MONTEREY */}
      <MontereySection tours={montereyTours} 
      sectionTitle={montereyHeading}
      categorySlug={
        montereyCategory?.cat_slug ||
        montereyCategory?.cat_name?.toLowerCase().replace(/\s+/g, "-") ||
        "monterey"
      }
      moreDetailsText={montereyMoreDetailsText}
      viewAllText={montereyViewAllText}
      popularText={montereyPopularText}
      recommendedText={montereyRecommendedText}
    />

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

