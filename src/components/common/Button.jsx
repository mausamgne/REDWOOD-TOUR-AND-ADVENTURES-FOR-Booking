export default function Button({
  children,
  variant = "primary",
  size = "md",
  customColor,
  className = "",
  as: Component = "button",
  ...props
}) {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none";
 
  const variants = {
    primary:
      "bg-primary text-white border border-transparent hover:opacity-90",
 
    outline:
      "border border text bg-transparent hover:bg-primary hover:text-white",
 
    light:
      "bg-gray-100 text-primary border border-transparent hover:bg-gray-200",
  };
 
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-sm md:text-base",
    lg: "px-7 py-3 text-base",
  };
 
  return (
    <Component
      style={customColor ? { backgroundColor: customColor } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}