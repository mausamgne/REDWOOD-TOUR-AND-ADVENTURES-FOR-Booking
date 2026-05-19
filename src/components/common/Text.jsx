export default function Text({
  children,
  className = "",
  as = "p",
}) {
  const Tag = as;

  return (
    <Tag className={`text leading-relaxed ${className}`}>
      {children}
    </Tag>
  );
}
