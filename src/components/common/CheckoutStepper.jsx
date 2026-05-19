import Text from "./Text";

export default function CheckoutStepper({ activeStep }) {
  const steps = [
    "Add To Cart",
    "Review Order",
    "Secure Checkout",
    "Order Placed",
  ];

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl">

        <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-6">

          {steps.map((label, index) => {
            const step = index + 1;
            const isActive = step === activeStep;
            const isCompleted = step < activeStep;

            return (
              <div key={step} className="flex-1 flex items-center">

                <div className="flex  items-center w-full">

                  {/* Circle */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 shrink-0
                      ${
                        isActive || isCompleted
                          ? "bg-primary text-white scale-105"
                          : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>

                  {/* Label */}
                  <Text
                    className={`ml-3 text-sm font-medium transition-all duration-300
                      ${
                        isActive || isCompleted
                          ? "text-primary font-semibold"
                          : "text-gray-600"
                      }`}
                  >
                    {label}
                  </Text>

                  {/* Connector Line */}
                  {step !== steps.length && (
                    <div
                      className={`flex-1 h-[2px] mx-4 min-w-[40px] hidden md:block transition-all duration-300
  ${isCompleted ? "bg-primary" : "bg-gray-300"}
`}
                    />
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}