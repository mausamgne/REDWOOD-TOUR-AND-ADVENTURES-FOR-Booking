export default function Badge({ children }) {
  return (
    <span className="px-3 py-1 text-xs font-semibold border border-green-700 text-green-800 rounded-full bg-green-100">
      {children}
    </span>
  );
}