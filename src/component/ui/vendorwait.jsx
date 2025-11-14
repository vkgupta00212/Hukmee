import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ShowOrders from "../../backend/order/showorder";
import GetVendor from "../../backend/authentication/getvendor";

// Reusable VendorCard
const VendorCard = ({
  title,
  vendorData = [],
  isLoading,
  isAccepted,
  vendorDetails,
  isVendorLoading,
}) => {
  const totalPrice = vendorData
    .reduce(
      (acc, item) =>
        acc + (parseFloat(item.Price) || 0) * (parseInt(item.Quantity) || 1),
      0
    )
    .toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8"
    >
      <h2
        className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${
          isAccepted
            ? "text-green-600"
            : "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
        }`}
      >
        {title}
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
          <p className="text-center text-gray-600 text-base font-medium">
            Finding the best vendor for you...
          </p>
          <p className="text-xs text-gray-500">This may take 10-30 seconds</p>
        </div>
      ) : (
        <>
          {isAccepted && (
            <div className="space-y-5">
              {/* Vendor Details */}
              <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  Vendor Assigned
                  {isVendorLoading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></span>
                  )}
                </h3>
                {vendorDetails ? (
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong className="text-gray-900">Name:</strong>{" "}
                      {vendorDetails.fullname}
                    </p>
                    <p>
                      <strong className="text-gray-900">Phone:</strong>{" "}
                      {vendorDetails.phoneNumber}
                    </p>
                    <p>
                      <strong className="text-gray-900">Address:</strong>{" "}
                      {vendorDetails.Address || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Loading vendor details...
                  </p>
                )}
              </div>

              {/* OTP */}
              {vendorData[0]?.OTP && (
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <p className="text-sm text-blue-700 font-medium mb-1">
                    Share this OTP with vendor
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-800 tracking-widest">
                    {vendorData[0].OTP}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          {vendorData.length > 0 && (
            <div className="mt-6 space-y-3">
              {vendorData.map((item) => (
                <div
                  key={item.ID}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <p className="font-medium text-gray-800 text-base">
                    {item.ItemName}
                  </p>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Qty: {item.Quantity || 1}
                    </span>
                    <p className="font-bold text-gray-900 mt-1 text-lg">
                      ₹{item.Price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Price */}
          {vendorData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-300 text-right">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                Total: <span className="text-orange-600">₹{totalPrice}</span>
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const VendorWait = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingCartItems = location.state?.cartItems || [];
  const [cartItems] = useState(
    Array.isArray(incomingCartItems) ? incomingCartItems : []
  );

  const orderId = cartItems[0]?.OrderID || "";
  const userPhone = localStorage.getItem("userPhone");

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes

  // Refs to prevent stale closures
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const hasAccepted = useRef(false);

  // 2-minute timeout → go home
  useEffect(() => {
    if (hasAccepted.current) return;

    timeoutRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timeoutRef.current);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [navigate]);

  // Polling for order status
  useEffect(() => {
    if (!userPhone || !orderId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const fetchOrderStatus = async () => {
      if (!isActive || hasAccepted.current) return;
      try {
        const res = await ShowOrders({
          orderid: orderId,
          UserID: userPhone,
          VendorPhone: "",
          Status: "Done",
        });

        if (!Array.isArray(res)) return;

        const currentOrder = res.find((o) => o.OrderID === orderId);

        if (
          currentOrder &&
          currentOrder.Status === "Done" &&
          !hasAccepted.current
        ) {
          hasAccepted.current = true;
          setIsAccepted(true);
          setVendorData(res.filter((o) => o.OrderID === orderId));
          setIsLoading(false);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          const vendorPhone = currentOrder.VendorPhone;
          if (vendorPhone && !vendorDetails) {
            setIsVendorLoading(true);
            try {
              const vendorRes = await GetVendor(vendorPhone);
              if (Array.isArray(vendorRes) && vendorRes.length > 0) {
                setVendorDetails(vendorRes[0]);
              }
            } catch (err) {
              console.error("Failed to load vendor:", err);
            } finally {
              setIsVendorLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      } finally {
        if (!hasAccepted.current) setIsLoading(false);
      }
    };

    // ✅ Start polling
    fetchOrderStatus();
    intervalRef.current = setInterval(fetchOrderStatus, 4000);

    // ✅ Handle when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !hasAccepted.current) {
        fetchOrderStatus(); // Trigger an instant refresh
      }
    };

    // ✅ Also handle when user refocuses the window (for mobile Safari / Chrome)
    const handleFocus = () => {
      if (!hasAccepted.current) {
        fetchOrderStatus(); // Instant refresh when focus returns
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      isActive = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [orderId, userPhone, vendorDetails]);

  // Reset loading state when not accepted
  useEffect(() => {
    if (!isAccepted && !hasAccepted.current) {
      setIsLoading(true);
    }
  }, [isAccepted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Fixed Header - Mobile Only */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            Vendor Assignment
          </h1>

          <div className="w-10" />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block pt-8 pb-4 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          Vendor Assignment
        </h1>
      </div>

      {/* Countdown Progress Bar */}
      {!isAccepted && secondsLeft > 0 && (
        <div className="fixed top-16 md:top-20 left-0 right-0 bg-gray-200 h-1.5 z-40 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 120, ease: "linear" }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20 md:py-24">
        <VendorCard
          title={
            isAccepted
              ? "Vendor Accepted!"
              : `Finding Vendor... (${secondsLeft}s)`
          }
          vendorData={vendorData}
          isLoading={isLoading && !isAccepted}
          isAccepted={isAccepted}
          vendorDetails={vendorDetails}
          isVendorLoading={isVendorLoading}
        />
      </div>

      {/* Last 10-sec Warning */}
      {!isAccepted && secondsLeft <= 10 && secondsLeft > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 md:left-1/3 md:right-1/3 text-center z-50"
        >
          <p className="text-sm font-medium text-red-600 bg-white rounded-full py-3 shadow-xl border border-red-200">
            No vendor accepted. Redirecting to home in {secondsLeft}s...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default VendorWait;
