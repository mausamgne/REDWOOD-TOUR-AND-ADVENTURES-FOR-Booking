import { useEffect, useState } from "react";
// import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRef } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

export default function AdminPanel() {
  const calendarRef = useRef(null);
  const isInitialMount = useRef(true);
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [appliedRange, setAppliedRange] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [total, setTotal] = useState(0);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [appliedFromDate, setAppliedFromDate] = useState(null);
  const [appliedToDate, setAppliedToDate] = useState(null);
  const [maxPriceLimit, setMaxPriceLimit] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateError, setDateError] = useState("");

  const [ordersPerPage, setOrdersPerPage] = useState(5);

  const fetchOrders = async ({
    search = searchText,
    min = priceRange[0],
    max = priceRange[1],
    page = currentPage,
    startDate = appliedFromDate || "",
    endDate = appliedToDate || "",
  } = {}) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/order/admin/all-orders?search=${search}&min=${min}&max=${max}&page=${page}&limit=${ordersPerPage}&startDate=${startDate}&endDate=${endDate}`,
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        setTotal(data.total);

        // 🔥 IMPORTANT ()
        setAllOrders((prev) => {
          return prev.length === 0 ? data.data : prev;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  //   useEffect(() => {
  //   if (!isLoaded) return;

  //   fetchOrders({
  //     page: currentPage,
  //     search: searchText,
  //     min: priceRange[0],
  //     max: priceRange[1],
  //     startDate: appliedFromDate || "",
  //     endDate: appliedToDate || "",
  //   });
  // }, [isLoaded]);

  useEffect(() => {
    if (maxPriceLimit === 0) {
      const FIXED_MAX = 100000; // 👈 sir ne bola

      setMaxPriceLimit(FIXED_MAX);

      if (isInitialMount.current) {
        setPriceRange((prev) => {
          if (prev[1] !== 0) return prev;
          return [0, FIXED_MAX];
        });

        isInitialMount.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    fetchOrders({
      page: currentPage,
    });
  }, [currentPage, ordersPerPage]);

  useEffect(() => {
    if (!isLoaded) return;
    const filters = {
      searchText,
      priceRange,
      currentPage,
      appliedFromDate,
      appliedToDate,
      ordersPerPage,
    };

    sessionStorage.setItem("adminFilters", JSON.stringify(filters));
  }, [
    searchText,
    priceRange,
    currentPage,
    appliedFromDate,
    appliedToDate,
    ordersPerPage,
  ]);

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("adminFilters"));

    if (saved) {
      setSearchText(saved.searchText || "");
      setPriceRange(saved.priceRange || [0, 100000]);
      setCurrentPage(saved.currentPage || 1);
      setOrdersPerPage(saved.ordersPerPage || 5);

      setAppliedFromDate(
        saved.appliedFromDate ? new Date(saved.appliedFromDate) : null,
      );

      setAppliedToDate(
        saved.appliedToDate ? new Date(saved.appliedToDate) : null,
      );

      // ✅ FETCH AFTER RESTORE
      fetchOrders({
        search: saved.searchText || "",
        min: saved.priceRange?.[0] || 0,
        max: saved.priceRange?.[1] || 100000,
        page: saved.currentPage || 1,
        startDate: saved.appliedFromDate || "",
        endDate: saved.appliedToDate || "",
      });
    } else {
      fetchOrders({
        page: 1,
      });
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePriceChange = (e, type) => {
    const value = e.target.value;

    // ❌ alphabet block
    if (!/^\d*$/.test(value)) return;

    // max 9 digit
    if (value.length > 9) return;

    let newMin = minPrice;
    let newMax = maxPrice;

    if (type === "min") {
      setMinPrice(value);
      newMin = value;
    } else {
      setMaxPrice(value);
      newMax = value;
    }

    // 🔥 VALIDATION
    let newErrors = {};

    if (newMin && newMax && Number(newMin) > Number(newMax)) {
      newErrors.max = "Min should not be greater than Max";
    }

    setErrors(newErrors);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const renderSortIcons = (field) => {
    const isActive = sortField === field;

    return (
      <span className="inline-flex flex-col ml-1 leading-none">
        <FaSortUp
          className={`-mb-1 text-sm ${
            isActive && sortOrder === "asc"
              ? "text-black font-bold"
              : "text-gray-400"
          }`}
        />

        <FaSortDown
          className={`-mt-1 text-sm ${
            isActive && sortOrder === "desc"
              ? "text-black font-bold"
              : "text-gray-400"
          }`}
        />
      </span>
    );
  };
  const maxPriceFromData = Math.max(
    ...orders.map((o) => Number(o.amount || 0)),
  );

  // const [maxPriceLimit, setMaxPriceLimit] = useState(0);

  // useEffect(() => {
  //   if (allOrders.length > 0 && maxPriceLimit === 0) {
  //     const maxVal = Math.max(...allOrders.map((o) => Number(o.amount || 0)));
  //     setMaxPriceLimit(maxVal);
  //   }
  // }, [allOrders]);

  const isMinActive = priceRange[0] > priceRange[1];
  const isMinOnTop = priceRange[0] > priceRange[1] - 50;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = [...orders].sort((a, b) => {
    let valA;
    let valB;

    switch (sortField) {
      case "serial":
        valA = a.createdAt;
        valB = b.createdAt;
        break;

      case "name":
        valA = `${a.user?.firstName || ""} ${a.user?.lastName || ""}`;
        valB = `${b.user?.firstName || ""} ${b.user?.lastName || ""}`;
        break;
      case "email":
        valA = a.user?.email || "";
        valB = b.user?.email || "";
        break;

      case "card":
        valA = a.card?.last4 || "";
        valB = b.card?.last4 || "";
        break;

      case "tour":
        valA = a.items?.[0]?.title || "";
        valB = b.items?.[0]?.title || "";
        break;

      case "amount":
        valA = Number(a.amount);
        valB = Number(b.amount);
        break;

      case "date":
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
        break;

      default:
        return 0;
    }

    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });
  const isInvalidRange = priceRange[0] > priceRange[1];
  const totalPages = Math.ceil(total / ordersPerPage);
  const formattedDate =
    appliedFromDate && appliedToDate
      ? `${new Date(appliedFromDate).toLocaleDateString()} - ${new Date(
          appliedToDate,
        ).toLocaleDateString()}`
      : appliedFromDate
        ? `${new Date(appliedFromDate).toLocaleDateString()}`
        : appliedToDate
          ? `${new Date(appliedToDate).toLocaleDateString()}`
          : "";
  return (
    <div className="p-4 md:p-10">
      <h1 className="text-xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium mb-1 text-gray-700">
            Search (Name / Email / Tour)
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Search name, email, tour..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-4 py-2 pr-10 rounded w-full"
            />

            {/* ICON */}
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
            >
              <FaCalendarAlt size={16} />
            </button>

            {/* ✅ CALENDAR YAHI ANDAR AAYEGA */}
            {showCalendar && (
              <div className="absolute right- top-full mt-2 z-50 w-[320px] translate-x-1/2">
                {/* 🔺 Arrow */}
                <div className="absolute -top-2 right-[18px] w-3 h-3 bg-white rotate-45 border-l border-t"></div>

                <div
                  ref={calendarRef}
                  className="bg-white shadow-xl rounded-lg p-4 border relative"
                >
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Booking Date
                  </label>
                  <div className="flex gap-3 items-center">
                    {/* FROM DATE */}
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => {
                        if (toDate && date > toDate) {
                          setDateError(
                            "From Date cannot be greater than To Date",
                          );
                          return;
                        }

                        setDateError("");
                        setFromDate(date);
                      }}
                      placeholderText="From Date"
                      className="border px-3 py-2 rounded w-full"
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      onKeyDown={(e) => e.preventDefault()}
                    />

                    {/* TO DATE */}
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => {
                        if (fromDate && date < fromDate) {
                          setDateError("To Date cannot be less than From Date");
                          return;
                        }

                        setDateError("");
                        setToDate(date);
                      }}
                      placeholderText="To Date"
                      className="border px-3 py-2 rounded w-full"
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </div>
                  {dateError && (
                    <p className="text-red-500 text-sm mt-2 font-medium">
                      {dateError}
                    </p>
                  )}

                  {/* BUTTONS */}
                  <div className="flex justify-end mt-3 gap-2">
                    {/* <button
                      onClick={() => setShowCalendar(false)}
                      className="px-3 py-1 border rounded"
                    >
                      Cancel
                    </button> */}

                    <button
                      onClick={() => {
                        setAppliedFromDate(fromDate);
                        setAppliedToDate(toDate);
                        setShowCalendar(false);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-1 bg-green-600 text-white rounded"
                    >
                      Apply
                    </button>

                    <button
                      onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setAppliedFromDate(null);
                        setAppliedToDate(null);

                        sessionStorage.removeItem("adminFilters");
                        setCurrentPage(1);
                        fetchOrders({ page: 1 });
                        setShowCalendar(false);
                      }}
                      className="px-3 py-1 border rounded text-red-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 📅 SELECTED DATE BOX */}
        {formattedDate && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Selected Booking Date
            </label>

            <div className="border px-4 py-2 rounded bg-gray-100 text-sm">
              {formattedDate}
            </div>
          </div>
        )}

        {/* PRICE RANGE */}
        <div className="flex flex-col w-72 ">
          {/* 🔴 LABEL ADD HERE */}
          <label className="text-sm font-medium mb-1 text-gray-700 mt-4 ">
            Price Range
          </label>

          <div className="flex items-center mt-3">
            <div className="w-full">
              {/* 🔥 SLIDER */}
              <Slider
                range
                min={0}
                allowCross={false}
                max={maxPriceLimit}
                value={priceRange}
                onChange={(val) => {
                  const [min, max] = val;

                  // ❌ stop crossing
                  if (min >= max) {
                    setErrors({
                      slider: "Min should be less than Max",
                    });

                    return;
                  }

                  // ✅ clear error
                  setErrors({});

                  setPriceRange(val);
                  setCurrentPage(1);
                }}
                trackStyle={[{ backgroundColor: "#22c55e", height: 8 }]}
                railStyle={{ backgroundColor: "#d1d5db", height: 8 }}
                tipFormatter={null}
                handleStyle={[
                  {
                    borderColor: "#22c55e",
                    backgroundColor: "#22c55e",
                    height: 20,
                    width: 20,
                    marginTop: -6,
                  },
                  {
                    borderColor: "#22c55e",
                    backgroundColor: "#22c55e",
                    height: 20,
                    width: 20,
                  },
                ]}
              />

              {/* 🔴 PRICE VALUES */}
              <div className="flex justify-between text-sm px-1 mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>

              {/* ❗ ERROR */}
              {errors.slider && (
                <p className="text-red-500 text-sm mt-1">{errors.slider}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            let newErrors = {};

            const min = Number(minPrice);
            const max = Number(maxPrice);

            if (minPrice && min < 0) {
              newErrors.min = "Min price cannot be negative";
            }

            if (maxPrice && max < 0) {
              newErrors.max = "Max price cannot be negative";
            }

            if (minPrice && maxPrice && min > max) {
              newErrors.max = "Min should not be greater than Max";
            }

            setErrors(newErrors);

            if (Object.keys(newErrors).length === 0) {
              fetchOrders({
                search: searchText,
                min: priceRange[0],
                max: priceRange[1],
                page: 1,
                startDate: appliedFromDate || "",
                endDate: appliedToDate || "",
              });
            }
          }}
          className="
             h-[42px]           
             px-6               
             rounded
             bg-green-600 text-white
             font-medium
             mt-3
            hover:bg-green-700
            active:scale-95 active:bg-green-800 active:shadow-inner
             transition-all duration-150
  "
        >
          Search
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg text-sm md:text-base">
          {/* TABLE HEADER */}
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th
                onClick={() => handleSort("serial")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  S.No
                  {renderSortIcons("serial")}
                </div>
              </th>
              <th
                onClick={() => handleSort("name")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Name
                  {renderSortIcons("name")}
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Email
                  {renderSortIcons("email")}
                </div>
              </th>
              <th
                onClick={() => handleSort("card")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Card
                  {renderSortIcons("card")}
                </div>
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Amount
                  {renderSortIcons("amount")}
                </div>
              </th>
              <th
                onClick={() => handleSort("tour")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Tour
                  {renderSortIcons("tour")}
                </div>
              </th>
              <th
                onClick={() => handleSort("date")}
                className="p-3 border cursor-pointer select-none"
              >
                <div className="flex items-center justify-center">
                  Booking Date
                  {renderSortIcons("date")}
                </div>
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-red-600 font-bold"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => {
                console.log(order.items);
                return (
                  <tr key={order._id} className="text-center hover:bg-gray-50">
                    <td className="p-3 border font-semibold">
                      {
  sortField === "serial" && sortOrder === "desc"
    ? (currentPage - 1) * ordersPerPage + currentOrders.length - index
    : (currentPage - 1) * ordersPerPage + index + 1
}
                    </td>
                    <td className="p-3 border">
                      {order.user?.firstName || "User"}{" "}
                      {order.user?.lastName || ""}
                    </td>

                    <td className="p-3 border">{order.user?.email}</td>

                    <td className="p-3 border">
                      {order.card?.last4
                        ? `**** **** **** ${order.card.last4}`
                        : "Saved Card"}
                    </td>

                    <td className="p-3 border font-semibold text-green-600">
                      ${order.amount}
                    </td>
                    <td className="p-3 border text-left">
                      {order.items?.map((item, i) => (
                        <div key={i} className="mb-3">
                          <div className="font-semibold text-gray-800">
                            {item.title}
                          </div>

                          <div className="text-sm text-gray-600">
                            ({item.travelDate || item.date}, {item.quantity}{" "}
                            Guest{item.quantity > 1 ? "s" : ""})
                          </div>

                          {/* {item.vehicle && (
  <div className="text-sm text-gray-600">
  By {
    item.vehicleName || 
    item.vehicle?.name || 
    (Number(item.quantity) >= 8 ? "VAN" : "SUV")
  }
</div>
)} */}
                        </div>
                      ))}
                    </td>

                    <td className="p-3 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="w-full flex items-center justify-between mt-6 px-4">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Records per page:</span>

            <select
              value={ordersPerPage}
              onChange={(e) => {
                setOrdersPerPage(Number(e.target.value));
                setCurrentPage(1);

                // ✅ scroll to top
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="border px-2 py-1 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* RIGHT SIDE */}
          {/* RIGHT SIDE */}
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{currentOrders.length}</span>{" "}
            Records | Total: <span className="font-semibold">{total}</span>
          </div>
        </div>{" "}
        <div className="flex justify-center mt-0  gap-2 items-center">
          {/* ⬅️ BACK */}
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            disabled={currentPage === 1}
            className="w-11 h-11 flex items-center justify-center 
             border border-gray-300 rounded-lg 
             bg-gray-100 text-gray-600 text-xl 
             hover:bg-gray-200 
             disabled:opacity-50"
          >
            ‹
          </button>
          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, arr) => {
              const prevPage = arr[index - 1];

              return (
                <div key={page} className="flex items-center gap-2">
                  {/* DOTS */}
                  {prevPage && page - prevPage > 1 && (
                    <span className="px-2">...</span>
                  )}

                  {/* PAGE BUTTON */}
                  <button
                    onClick={() => {
                      setCurrentPage(page);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className={`px-4 py-2 border rounded ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}

          {/* ➡️ NEXT */}
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            disabled={currentPage === totalPages}
            className="w-11 h-11 flex items-center justify-center 
             border border-gray-300 rounded-lg 
             bg-gray-100 text-gray-600 text-xl 
             hover:bg-gray-200 
             disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
// export default AdminPanel;
