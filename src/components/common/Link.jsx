import { Link as RouterLink } from "react-router-dom";

export default function Link({
  href,
  to,
  children,
  className = "",
  external = false,
}) {
  const baseStyle = "font-medium whitespace-nowrap transition duration-200";

  const finalPath = to || href || "#";

  if (external || finalPath.startsWith("http")) {
    return (
      <a
        href={finalPath}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyle} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={finalPath}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </RouterLink>
  );
}