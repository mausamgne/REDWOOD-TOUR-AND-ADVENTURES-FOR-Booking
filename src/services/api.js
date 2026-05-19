// 🔥 EXTERNAL API (unchanged)
const EXTERNAL_BASE_URL =
  "https://adminzwy8.redwoodnationalparktours.com/api";

export const getHomepage = async ({
  langId = 1,
  websiteId = 1,
} = {}) => {
  try {
    const response = await fetch(
      `${EXTERNAL_BASE_URL}/get_homepage?lang_id=${langId}&website_id=${websiteId}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch homepage data (Status: ${response.status})`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Homepage API Error:", error);
    throw error;
  }
};



// 🔥 LOCAL BACKEND API (FINAL FIXED)
const LOCAL_BASE_URL = "http://localhost:5000/api";

export const createOrder = async (data) => {
  try {
    const token = localStorage.getItem("token"); // 🔥 ADD THIS

    const res = await fetch(`${LOCAL_BASE_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 MOST IMPORTANT
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create order");
    }

    return await res.json();
  } catch (err) {
    console.log("❌ Create Order Error:", err.message);
    throw err;
  }
};