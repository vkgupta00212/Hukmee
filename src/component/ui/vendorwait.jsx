import React, { useState, useEffect } from "react";
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
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8">
      <h2
        className={`text-3xl font-bold text-center mb-6 ${
          isAccepted
            ? "text-green-600"
            : "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
        }`}
      >
        {title}
      </h2>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-orange-500"></div>
          <p className="text-center text-gray-600 text-base mt-4">
            Finding the best vendor for you...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This may take 10-30 seconds
          </p>
        </div>
      ) : (
        <>
          {isAccepted && (
            <div className="space-y-4">
              {/* Vendor Details */}
              <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  Vendor Assigned
                  {isVendorLoading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></span>
                  )}
                </h3>
                {vendorDetails ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {vendorDetails.fullname}
                    </p>
                    <p>
                      <strong>Phone:</strong> {vendorDetails.phoneNumber}
                    </p>
                    <p>
                      <strong>Address:</strong> {vendorDetails.Address || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">
                    Loading details...
                  </p>
                )}
              </div>

              {/* OTP */}
              {vendorData[0]?.OTP && (
                <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 text-center">
                  <p className="text-sm text-blue-600 font-medium">
                    Share this OTP with vendor
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-2 tracking-widest">
                    {vendorData[0].OTP}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          {vendorData.length > 0 ? (
            <div className="mt-6 space-y-3">
              {vendorData.map((item) => (
                <div
                  key={item.ID}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <p className="font-medium text-gray-800">{item.ItemName}</p>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Qty: {item.Quantity || 1}
                    </span>
                    <p className="font-bold text-gray-900 mt-1">
                      ₹{item.Price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Total */}
          {vendorData.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-300 text-right">
              <p className="text-xl font-bold text-gray-900">
                Total: <span className="text-orange-600">₹{totalPrice}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
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

  // 2-minute timeout → go home
  useEffect(() => {
    if (isAccepted) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAccepted, navigate]);

  // Polling for order status
  useEffect(() => {
    if (!userPhone || !orderId) {
      setIsLoading(false);
      return;
    }

    let interval = null;

    const fetchOrderStatus = async () => {
      try {
        const res = await ShowOrders({
          orderid: orderId,
          UserID: userPhone,
          VendorPhone: "",
          Status: "Done",
        });

        if (!Array.isArray(res)) return;

        const currentOrder = res.find((o) => o.OrderID === orderId);

        if (currentOrder && currentOrder.Status === "Done") {
          setIsAccepted(true);
          setVendorData(res.filter((o) => o.OrderID === orderId));
          setIsLoading(false);
          if (interval) clearInterval(interval);

          const vendorPhone = currentOrder.VendorPhone;
          if (vendorPhone && !vendorDetails) {
            setIsVendorLoading(true);
            try {
              const vendorRes = await GetVendor(vendorPhone);
              if (Array.isArray(vendorRes) && vendorRes.length > 0) {
                setVendorDetails(vendorRes[0]);
              }
            } finally {
              setIsVendorLoading(false);
            }
          }
        } else {
          setIsAccepted(false);
          setVendorData([]);
          setVendorDetails(null);
        }
      } catch (error) {
        console.error("Polling error:", error);
      } finally {
        if (!isAccepted) setIsLoading(false);
      }
    };

    fetchOrderStatus();
    if (!isAccepted) interval = setInterval(fetchOrderStatus, 5000);

    return () => interval && clearInterval(interval);
  }, [orderId, userPhone, isAccepted, vendorDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
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

          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            Vendor Assignment
          </h1>

          <div className="w-10" />
        </div>
      </div>

      {/* Countdown Progress Bar */}
      {!isAccepted && secondsLeft > 0 && (
        <div className="fixed top-16 left-0 right-0 bg-gray-100 h-1 z-40 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 120, ease: "linear" }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>

      {/* Last 10-sec Warning */}
      {!isAccepted && secondsLeft <= 10 && secondsLeft > 0 && (
        <div className="fixed bottom-6 left-0 right-0 text-center px-4">
          <p className="text-sm font-medium text-red-600 bg-white rounded-full py-2 shadow-lg">
            No vendor accepted. Redirecting to home in {secondsLeft}s...
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorWait;
