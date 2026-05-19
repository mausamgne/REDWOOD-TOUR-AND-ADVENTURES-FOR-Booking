import DesktopNav from "./Desktop";

export default function Navbar({ items, tours, user }) {
  if (!items || items.length === 0) return null;

  const otherIndex = items.findIndex((item) =>
    item?.cat_name?.toLowerCase().includes("other")
  );

  const filteredItems =
    otherIndex !== -1 ? items.slice(0, otherIndex + 1) : items;

  return (
    <nav className="w-full bg-primary hidden lg:block relative z-40">
      <div className="w-full max-w-7xl  px-6">
        <DesktopNav items={filteredItems} tours={tours} />
      </div>
    </nav>
  );
}
