import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GetOrder from "../../backend/order/getorderid";
import GetSubCategory from "../../backend/homepageimage/getcategory";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/hukmee.png";
import WomensSalonCard from "./womensaloonCard";

const CartWithBadge = ({ count }) => (
  <div className="relative cursor-pointer transition-transform hover:scale-110 group">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-gray-800 group-hover:text-gray-600 transition-colors"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
        {count > 99 ? "99+" : count}
      </div>
    )}
  </div>
);

const MobileHeader = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [subcategory, setSubcategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userID = localStorage.getItem("userPhone");
  const dropdownRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setActiveModal("category");
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch Cart Count
  useEffect(() => {
    const fetchOrder = async () => {
      if (!userID) {
        setCartCount(0);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await GetOrder(userID, "Pending");
        if (response?.items?.length) {
          setCartCount(response.items.length);
        } else if (Array.isArray(response)) {
          setCartCount(response.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [userID]);

  // ✅ Fetch Subcategory List
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const data = await GetSubCategory();
        console.log("Fetched categories:", data);
        if (Array.isArray(data)) {
          setSubcategory(data);
          setFilteredResults(data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategory();
  }, []);

  // ✅ Filter subcategories when typing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults(subcategory);
      return;
    }
    const filtered = subcategory.filter((item) =>
      item.ServiceName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchTerm, subcategory]);

  // ✅ Handle selecting a search result

  return (
    <div>
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer group space-x-1 px-[10px]"
      >
        <img
          src={logo}
          alt="WePrettify Logo"
          className="w-45 h-30 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <header className="w-full rounded-[10px] border-b border-gray-300 flex justify-between py-2 px-2 bg-inherit sm:px-6 sm:py-4 sticky top-0 z-50">
        {/* 🔍 Search Section */}

        <div className="flex flex-col mx-auto relative" ref={dropdownRef}>
          <div className="w-[300px] mx-auto p-[1px]">
            <div
              className="flex items-center border border-gray-300 rounded-[10px] px-2 py-2 bg-white cursor-text"
              onClick={() => setIsDropdownOpen(true)}
            >
              <FiSearch className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search for ‘Brands’"
                value={searchTerm}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow outline-none text-gray-600 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* 🧭 Dropdown Results */}
          {isDropdownOpen && (
            <div className="absolute top-[60px] left-0 w-[300px] bg-white border border-gray-200 rounded-[10px] shadow-xl z-50 max-h-[250px] overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleServiceClick(item)} // ✅ use function
                  >
                    <img
                      src={`https://api.hukmee.in/${item.ServiceImage}`}
                      alt={item.ServiceName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="text-gray-800 font-medium">
                      {item.ServiceName}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center text-sm">
                  No matching results found
                </div>
              )}
            </div>
          )}

          <AnimatePresence>
            {activeModal === "category" && (
              <motion.div
                key="modal-category"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 100 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <WomensSalonCard
                    onClose={() => setActiveModal(null)}
                    service={selectedService}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🛒 Cart Section */}
        <button
          onClick={() => navigate("/cartpage")}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <CartWithBadge count={cartCount} />
          )}
        </button>
      </header>
    </div>
  );
};

export default MobileHeader;
