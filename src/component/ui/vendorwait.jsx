import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ShowOrders from "../../backend/order/showorder";

// ✅ Reusable VendorCard component
const VendorCard = ({ title, vendorData = [], isLoading, isAccepted }) => {
  const totalPrice = vendorData
    .reduce(
      (acc, item) =>
        acc + (parseFloat(item.Price) || 0) * (parseInt(item.Quantity) || 1),
      0
    )
    .toFixed(2);

  return (
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8">
      {/* Heading */}
      <h2
        className={`text-3xl font-bold text-center mb-6 ${
          isAccepted
            ? "text-green-600"
            : "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
        }`}
      >
        {title}
      </h2>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-center text-gray-500 text-sm mt-4 animate-pulse">
            Finding vendor, please wait for a moment...
          </p>
        </div>
      ) : (
        <>
          {/* Vendor Items */}
          {vendorData.length > 0 ? (
            <div className="space-y-4">
              {vendorData.map((item) => (
                <div
                  key={item.ID}
                  className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                  role="listitem"
                >
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">
                      {item.ItemName || "Unknown Item"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center border border-orange-200 bg-orange-50 rounded-full px-3 py-1 text-xs font-medium text-orange-600">
                      Qty: {item.Quantity || 1}
                    </div>
                    <p className="text-sm font-bold mt-2 text-gray-800">
                      ₹{item.Price || "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">
              No vendor data available.
            </p>
          )}

          {/* Total Section */}
          {vendorData.length > 0 && (
            <div className="mt-6 text-right border-t border-gray-200 pt-4">
              <p className="text-lg font-semibold text-gray-900">
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
  const incomingCartItems = location.state?.cartItems || [];
  const [cartItems, setCartItems] = useState(
    Array.isArray(incomingCartItems) ? incomingCartItems : []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [vendorAccepted, setVendorAccepted] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  const VendorPhone = localStorage.getItem("userPhone");

  // 🧠 Fetch orders to check status
  useEffect(() => {
    const fetchShowOrders = async () => {
      try {
        const res = await ShowOrders({
          UserID: "",
          VendorPhone: VendorPhone,
          Status: "Done",
        });

        if (Array.isArray(res) && res.length > 0) {
          // Filter for your current order if needed (using OrderID or ItemName match)
          const doneOrders = res.filter((order) => order.Status === "Done");

          if (doneOrders.length > 0) {
            setVendorAccepted(true);
            setVendorData(doneOrders);
          } else {
            setVendorAccepted(false);
            setVendorData([]);
          }
        } else {
          setVendorAccepted(false);
        }
      } catch (error) {
        console.error("Error checking order status:", error);
        setVendorAccepted(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowOrders();

    // Optional: Poll every 5 seconds to check live updates
    const interval = setInterval(fetchShowOrders, 5000);
    return () => clearInterval(interval);
  }, [VendorPhone]);

  // Calculate total price
  const totalPrice = cartItems
    .reduce(
      (acc, item) =>
        acc + (parseFloat(item.Price) || 0) * (parseInt(item.Quantity) || 1),
      0
    )
    .toFixed(2);

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-wrap items-start justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8">
      {/* Left - User’s Service Card */}

      {/* Right - Vendor Status Card */}
      <VendorCard
        title={vendorAccepted ? "Vendor Accepted ✅" : "Finding Vendor ⏳"}
        vendorData={vendorData}
        isLoading={isLoading && !vendorAccepted}
        isAccepted={vendorAccepted}
      />
    </div>
  );
};

export default VendorWait;
