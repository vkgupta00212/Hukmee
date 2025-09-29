import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import GetUser from "../backend/authentication/getuser";
import GetWallet from "../backend/getwallet/getwallet";
import logo from "../assets/hukmee.png";

const Navigation = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState([]);
  const phone = localStorage.getItem("userPhone");
  const [wallet, setWallet] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const fetchedUser = await GetUser(phone);
        console.log("Fetched from the Navigation ", { fetchedUser });
        setUser(fetchedUser || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (phone) fetchuser();
  }, [phone]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await GetWallet(phone);
        console.log("Fetched from the Navigation ", { data });
        setWallet(data || []);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };
    if (phone) fetchWallet();
  }, [phone]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer group space-x-3"
          >
            <img
              src={logo}
              alt="WePrettify Logo"
              className="w-45 h-25 rounded-[3px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 text-lg font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/course", label: "Career" },
              { to: "/skinanalyzer", label: "Used Products" },
              { to: "/productscreen", label: "New Products" },
            ].map((item) =>
              item.to.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="relative text-gray-700 hover:text-[#FA7D09] transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA7D09] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="relative text-gray-700 hover:text-[#FA7D09] transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA7D09] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )
            )}

            {isLoggedIn ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-3 cursor-pointer select-none group"
                  onClick={() => setOpen(!open)}
                >
                  <img
                    src={
                      user[0]?.Image
                        ? `https://weprettify.com/images/${user[0].Image}`
                        : "https://via.placeholder.com/150?text=Avatar"
                    }
                    alt={user[0]?.Fullname || "Profile"}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 group-hover:border-[#FA7D09] transition-all duration-300"
                  />

                  <span className="text-base font-medium text-gray-700 group-hover:text-[#FA7D09] transition-colors duration-300">
                    {user[0]?.Fullname || ""}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 group-hover:text-[#FA7D09] transition-all duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-xl w-56 z-50 text-sm border border-gray-100 transform transition-all duration-300 scale-95 origin-top-right animate-in">
                    <Link
                      to="/userprofile"
                      className="block px-5 py-3 hover:bg-indigo-50 hover:text-[#FA7D09] transition-colors duration-200 text-gray-700 first:rounded-t-xl"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/transactions"
                      className="flex justify-between items-center px-5 py-3 hover:bg-indigo-50 hover:text-[#FA7D09] transition-colors duration-200 text-gray-700 first:rounded-t-xl"
                    >
                      <span>Wallet</span>
                      <span className="font-semibold text-[#FA7D09]">
                        ₹{wallet[0]?.WalletBalance || 0}
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3 hover:bg-indigo-50 hover:text-[#FA7D09] transition-colors duration-200 text-red-500 last:rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-[#FA7D09] text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
