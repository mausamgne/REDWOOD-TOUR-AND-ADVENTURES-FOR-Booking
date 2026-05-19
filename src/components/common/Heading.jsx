export default function Heading({
  as = "h1",
  children,
  align = "",
  color = "",
  split = false,
  shadow = false,
  className = "",
}) {
  const Tag = as;
 
  const sizes = {
    h1: "text-2xl md:text-3xl lg:text-3xl",
    h2: "text-xl md:text-2xl lg:text-3xl",
    h3: "text-lg md:text-xl",
    h4: "text-base md:text-lg",
    h5: "text-sm md:text-base",
    h6: "text-xs md:text-sm",
  };
 
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
 
  const renderContent = () => {
    if (!split || typeof children !== "string" || !children.includes("&")) {
      return children;
    }
 
    const parts = children.split("&");
 
    return (
      <>
        <span className="block">{parts[0].trim()}</span>
        <span className="block">& {parts[1].trim()}</span>
      </>
    );
  };
 
  return (
    <Tag
      className={`font-extrabold leading-tight ${sizes[as]} ${alignment[align]} ${color} ${
        shadow ? "drop-shadow-md" : ""
      } ${className}`}
    >
      {renderContent()}
    </Tag>
  );
}