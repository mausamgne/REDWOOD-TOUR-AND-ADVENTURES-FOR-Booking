// External website/admin API
const EXTERNAL_BASE_URL =
  "https://adminzwy8.redwoodnationalparktours.com/api";

// Your own backend API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LOCAL_BASE_URL = `${API_BASE_URL}/api`;

export const getHomepage = async ({ langId = 1, websiteId = 1 } = {}) => {
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

export const createOrder = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${LOCAL_BASE_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create order");
    }

    return await res.json();
  } catch (err) {
    console.log("Create Order Error:", err.message);
    throw err;
  }
};