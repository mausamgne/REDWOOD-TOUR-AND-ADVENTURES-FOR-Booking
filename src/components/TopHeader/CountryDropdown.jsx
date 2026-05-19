import { useState, useRef, useEffect } from "react";
// import { ChevronDown } from "lucide-react";

export default function CountrySelector({
  languages = [],
  currentLangId,
  onLanguageChange,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  // 🔥 Sync selected language when languages or langId changes
  useEffect(() => {
    if (!languages.length) return;

    const activeLang =
      languages.find((lang) => Number(lang.id) === Number(currentLangId)) ||
      languages[0];

    setSelected(activeLang);
  }, [languages, currentLangId]);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!languages.length) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Selected Language */}
      <div
        onClick={() => {}}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={selected?.flag}
          alt={selected?.name}
          className="w-6 h-4 object-cover"
        />
        {/* <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        /> */}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded-md w-40 z-50">
          {languages
  .filter((lang) => lang.name === "EN")
  .map((lang) => (
            <div
              key={lang.id}
              onClick={() => {
                setOpen(false);
                setSelected(lang); // update selected visually

                if (onLanguageChange) {
                  onLanguageChange(Number(lang.id)); // 🔥 FIX: force number
                }
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="w-5 h-3"
              />
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}