export default function PrimaryButton({
  children,
  className = "",
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={`group flex items-center
                  bg-[#2f6417] text-white
                  rounded-full
                  pl-6 pr-2 py-2
                  font-semibold text-sm
                  transition-all duration-300
                  hover:bg-[#255313]
                  ${className}`}
      {...props}
    >
      <span>{children}</span>
 
      <span
        className="ml-4 flex items-center justify-center
                   w-10 h-10
                   rounded-full
                   bg-white
                   transition-all duration-300
                   group-hover:translate-x-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#4e8a27]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M13 6l6 6-6 6"
          />
        </svg>
      </span>
    </Component>
  );
}
 