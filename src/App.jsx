import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ReviewOrder from "./pages/ReviewOrder";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import CategoryPage from "./pages/CategoryPage";
import TourDetails from "./pages/TourDetails";
import OrderPlaced from "./pages/OrderPlaced";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import AdminPanel from "./pages/AdminPanel";
import DynamicPage from "./pages/DynamicPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import TestimonialsPage from "./pages/TestimonialsPage";
import ScrollToTop from "./components/common/ScrollToTop";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OurGuides from "./pages/OurGuides";
import Careers from "./pages/Careers";
import Faqs from "./pages/Faqs";
import FleetPage from "./pages/FleetPage";
import Sitemap from "./pages/Sitemap";
import ExpressCheckout from "./pages/ExpressCheckout";
export default function App() {
  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      <Routes>
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="terms-and-conditions" element={<TermsConditions />} />
<Route path="privacy-policy" element={<PrivacyPolicy />} />
<Route path="our-guides" element={<OurGuides />} />
<Route path="careers" element={<Careers />} />
<Route path="faqs" element={<Faqs />} />
<Route path="fleet-page" element={<FleetPage />} />
<Route path="sitemap" element={<Sitemap />} />
<Route path="express-checkout" element={<ExpressCheckout />} />

        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminPanel />} />

          <Route index element={<Home />} />

          <Route path="cart" element={<Cart />} />

          <Route path="category/:categorySlug" element={<CategoryPage />} />
          <Route path="/:pageSlug" element={<DynamicPage />} />

          <Route path="tour/:tourSlug" element={<TourDetails />} />

          <Route path="review-order" element={<ReviewOrder />} />

          <Route path="order-placed" element={<OrderPlaced />} />
          <Route path="testimonials" element={<TestimonialsPage />} />

          <Route path="testimonials/:id" element={<TestimonialsPage />} />

          <Route path="reviews" element={<TestimonialsPage />} />

          <Route path=":pageSlug" element={<DynamicPage />} />
        </Route>
      </Routes>
    </>
  );
}
