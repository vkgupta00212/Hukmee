import React from "react";
import CartPage from "./cartpage";

const CartMain = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col w-full items-start mb-6">
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-start px-4 py-3 sm:px-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CartPage
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <main className="mt-[70px] w-full max-w-5xl bg-white rounded-xl shadow-md p-2 sm:p-8 lg:p-10 transition-all duration-300">
          <CartPage />
        </main>

        {/* Footer Section */}
        <footer className="mt-8 w-full max-w-5xl text-center py-4">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Contact Support
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CartMain;
