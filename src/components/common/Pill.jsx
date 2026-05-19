export default function Pill({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-primary text-white",
    popular: "bg-[#4f772d] text-white",
    recommended: "bg-[#5e8f3b] text-white",
    top: "bg-[#3f6f1d] text-white",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        text-[11px] md:text-xs
        font-semibold
        px-3 py-1
        rounded-full
        tracking-wide
        shadow-sm
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
