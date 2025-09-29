import React, { useState } from "react";
import Home from "../pages/Index";
import SkinAnalyzer from "./ui/skinanalyzer";
import Services from "../pages/Index";
import ProductScreen from "./ui/products";
import UserProfile from "./ui/userprofile";
import skin from "../assets/skinanalyze.jpg";

const navItems = [
  {
    label: "WP",
    icon: (
      <div className="text-[10px] w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 group-hover:scale-110">
        WP
      </div>
    ),
    component: <Home />,
    notification: false,
  },
  {
    label: "Skin Analyzer",
    icon: <img src={skin} className="h-10" />,
    component: <SkinAnalyzer />,
    notification: false,
  },
  {
    label: "Products",
    icon: (
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="4" width="14" height="10" fill="#6b7280" />
          <rect x="3" y="2" width="10" height="3" fill="#ffffff" />
        </svg>
      </div>
    ),
    component: <ProductScreen />,
    notification: true,
  },
  {
    label: "Profile",
    icon: (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110">
        👤
      </div>
    ),
    component: <UserProfile />,
    notification: false,
  },
];

const MobileNavbar = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-1 pb-20"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {navItems[activeTab].component}
      </div>

      {/* Bottom Navbar */}
      <nav
        className="fixed bottom-0 left-0 w-full h-17 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-6px_15px_rgba(0,0,0,0.1)] flex justify-around items-center z-50 transition-all duration-500"
        aria-label="Mobile navigation"
      >
        {navItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(index)}
            className={`group flex flex-col items-center justify-center relative w-1/4 py-2 transition-all duration-300 hover:bg-indigo-50/70 rounded-xl ${
              activeTab === index ? "text-indigo-700" : "text-gray-600"
            }`}
            aria-label={`${item.label} tab`}
            aria-current={activeTab === index ? "page" : undefined}
          >
            <div className="relative flex items-center justify-center">
              {item.icon}
              {item.notification && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                activeTab === index ? "font-semibold text-indigo-700" : ""
              } group-hover:text-indigo-700`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavbar;
