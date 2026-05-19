export default function Link({
  href = "#",
  children,
  className = "",
  external = false,
}) {
  const baseStyle =
    "font-medium whitespace-nowrap transition duration-200";

  return (
    <a
      href={href}
      className={`${baseStyle} ${className}`}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </a>
  );
}
