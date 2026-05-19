import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [allTours, setAllTours] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://adminzwy8.redwoodnationalparktours.com/api/get_homepage?lang_id=1&website_id=1",
    )
      .then((res) => res.json())
      .then((data) => {
        const tours = data.top_navigation.flatMap(
  (item) => item.tours || []
);
        setAllTours(tours);
      });
  }, []);

  const filteredTours = allTours.filter((tour) =>
    tour?.tour_title?.toLowerCase().includes(search.toLowerCase()),
  );
  //  //API SEARCH
  // useEffect(() => {
  //   if (!search.trim()) {
  //     setResults([]);
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     fetch(`http://localhost:5000/api/search?q=${search}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setResults(data);
  //       })
  //       .catch((err) => console.log(err));
  //   }, 300);

  //   return () => clearTimeout(timer);

  // }, [search]);

  return (
    <div className="relative w-full md:w-[350px]">
      {/* SEARCH INPUT */}
      <div className="flex items-center border-2 border-[#4f772d] rounded-full px-5 py-3 bg-white">
        <Search size={18} className="text-[#4f772d]" />

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-3 outline-none bg-transparent w-full text-base"
        />

        {search && (
          <button onClick={() => setSearch("")}>
            <X size={18} className="text-[#4f772d]" />
          </button>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {search && filteredTours.length > 0 && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-2xl rounded-xl border z-50 max-h-[350px] overflow-y-auto">
          {filteredTours.map((tour, index) => (
            <div
              key={index}
              className="p-4 border-b hover:bg-gray-100 cursor-pointer transition"
              onClick={() => {
                navigate(`/tour/${tour.tour_slug}`);
                setSearch("");
              }}
            >
              <p className="text-[16px] leading-6 text-gray-800">
                {tour.tour_title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
