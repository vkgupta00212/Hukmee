import React from "react";
import CartPage from "./cartpage";
import { useNavigate } from "react-router-dom";
import Colors from "../../core/constant";

const CartMain = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-1 sm:p-6 lg:p-8">
      {/* Header Section */}{" "}
      <div className="w-full max-w-5xl flex flex-col items-center">
        {" "}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
          {" "}
          <div className="flex ml-10  px-4 py-3 sm:px-6">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Go back"
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />{" "}
              </svg>{" "}
            </button>{" "}
            <h2
              className={`text-xl sm:text-3xl font-bold bg-${Colors.primaryMain} bg-clip-text text-transparent`}
            >
              CartPage{" "}
            </h2>{" "}
          </div>{" "}
        </div>
        {/* Main Content */}
        <main className="mt-[90px] w-full max-w-3xl bg-white rounded-xl shadow-md p-4 sm:p-8 lg:p-10 transition-all duration-300">
          <CartPage />
        </main>
        {/* Footer Section */}
        {/* <footer className="mt-8 w-full max-w-3xl text-center py-4">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Contact Support
            </a>
          </p>
        </footer> */}
      </div>
    </div>
  );
};

export default CartMain;
