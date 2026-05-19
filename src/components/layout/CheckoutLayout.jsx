import CheckoutStepper from "../common/CheckoutStepper";
import Heading from "../common/Heading";
 
export default function CheckoutLayout({ step, children }) {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
     
      {/* Stepper */}
      <div className="mb-10">
        <CheckoutStepper activeStep={step} />
      </div>
 
      {/* Page Title */}
      <Heading
        as="h1"
        className="text-2xl md:text-4xl text-primary font-bold text-center mb-8"
      >
        Redwoods Tours Specialist
      </Heading>
 
      {/* 🔥  */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
 
    </div>
  );
}