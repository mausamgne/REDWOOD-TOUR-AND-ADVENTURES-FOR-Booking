import { useNavigate } from "react-router-dom";
import CheckoutStepper from "../components/common/CheckoutStepper";
import { BASE_PATH } from "../utils/constants";

export default function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* ✅ COMMON STEPPER */}
        <div className="mb-12">
          <CheckoutStepper activeStep={4} />
        </div>

        {/* ✅ Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">

          <div className="text-green-600 text-5xl mb-6">✓</div>

          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Order Placed Successfully!
          </h2>

          <p className="text-gray-600 text-lg mb-8">
            Thank you for booking with us.
            <br />
            A confirmation email has been sent to your registered email address.
          </p>

          <button
  type="button"
  onClick={() => navigate("/")}
  className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition"
>
  Back To Home
</button>

        </div>

      </div>

    </div>
  );
}