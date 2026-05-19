import Heading from "./Heading";

export default function SectionHeading({ children }) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 mb-14 w-full px-4">

      {/* Left Line */}
      <div className="flex-1 h-[2px] bg-[#3f6f1d] min-w-[40px]" />

      {/* Pill Heading */}
      <Heading
        as="h2"
        align="center"
        color="text-white"
        className="
          bg-[#3f6f1d]
          px-8 sm:px-12
          py-3 sm:py-4
          rounded-full
          text-lg sm:text-2xl lg:text-3xl
          font-bold
          shadow-md
          text-center
          whitespace-normal
          break-words
        "
      >
        {children}
      </Heading>

      {/* Right Line */}
      <div className="flex-1 h-[2px] bg-[#3f6f1d] min-w-[40px]" />

    </div>
  );
}
