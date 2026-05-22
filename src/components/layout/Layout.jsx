import { useEffect, useState } from "react";
import { getHomepage } from "../../services/api";

import TopBar from "../TopHeader/TopBar";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import MobileDrawer from "../TopHeader/MobileDrawer";
import Footer from "../Footer/Footer";
import FloatingChatButton from "../layout/FloatingChatButton";

import { Outlet } from "react-router-dom";

export default function Layout() {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ✅ Correct language state
  const [currentLangId, setCurrentLangId] = useState(
    Number(localStorage.getItem("langId")) || 1,
  );

  // ✅ Fetch homepage whenever language changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getHomepage({ langId: currentLangId });

        setHomepageData(data);
      } catch (error) {
        console.error("Homepage fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLangId]);

  // ✅ Handle language change
  const handleLanguageChange = (id) => {
    setCurrentLangId(id);
    localStorage.setItem("langId", id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  const homepageInfo = homepageData.homepage_data?.[0];
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-white">
      {/* TOP BAR */}
      <TopBar
        contactNumber={homepageInfo?.contact_number}
        languages={homepageData?.languages}
        setDrawerOpen={setDrawerOpen}
        chatLink={homepageInfo?.chat_button_link}
        chatText={homepageInfo?.chat_button_text}
        onLanguageChange={handleLanguageChange}
        currentLangId={currentLangId}
      />

      <Header
        data={homepageInfo}
        logo={homepageInfo?.website_logo}
        currentLangId={currentLangId}
        user={user} // 🔥 ADD THIS
      />

      <Navbar
        items={homepageData.top_navigation}
        tours={homepageData.tours}
        user={user} // 🔥 ADD THIS
      />

      <main className="relative">
        <Outlet context={{ homepageData, currentLangId }} />
      </main>

      <MobileDrawer
        items={homepageData.top_navigation}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />

      <Footer homepageData={homepageData} />

      <FloatingChatButton />
    </div>
  );
}
