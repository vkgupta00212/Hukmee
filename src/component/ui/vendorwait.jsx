import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// ✅ Reusable VendorCard component
const VendorCard = ({ title, vendorData = [], isLoading }) => {
  const totalPrice = vendorData
    .reduce((acc, item) => acc + (item.Price || 0) * (item.Quantity || 1), 0)
    .toFixed(2);

  return (
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-6">
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
                    {item.duration && (
                      <p className="text-xs text-gray-500 mt-1">
                        Duration: {item.duration}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center border border-orange-200 bg-orange-50 rounded-full px-3 py-1 text-xs font-medium text-orange-600 hover:border-orange-300 transition-colors">
                      <span>Qty: {item.Quantity || 1}</span>
                    </div>
                    <p className="text-sm font-bold mt-2 text-gray-800">
                      ₹{item.Price?.toFixed(2) || "0.00"}
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

  // Example: multiple vendors (mock data for now)
  const [vendors, setVendors] = useState([
    { id: 1, name: "Accepted Vendor 1", items: incomingCartItems },
    { id: 2, name: "Accepted Vendor 2", items: incomingCartItems },
  ]);

  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Received cart items in VendorWait:", cartItems);
    }
    setIsLoading(false);
  }, [cartItems]);

  // Calculate total for service card
  const totalPrice = cartItems
    .reduce((acc, item) => acc + (item.Price || 0) * (item.Quantity || 1), 0)
    .toFixed(2);

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-wrap items-start justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8">
      {/* Left Side - Your Service */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8">
        {/* <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-6">
          Your Service
        </h2> */}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-center text-gray-500 text-sm mt-4 animate-pulse">
              Finding vendor, please wait for a moment...
            </p>
          </div>
        ) : (
          <>
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.ID}
                    className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                    role="listitem"
                  >
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {item.ItemName || "Unknown Item"}
                      </p>
                      {item.duration && (
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {item.duration}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center border border-orange-200 bg-orange-50 rounded-full px-3 py-1 text-xs font-medium text-orange-600 hover:border-orange-300 transition-colors">
                        <span>Qty: {item.Quantity || 1}</span>
                      </div>
                      <p className="text-sm font-bold mt-2 text-gray-800">
                        ₹{item.Price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">
                Your cart is empty.
              </p>
            )}
            {cartItems.length > 0 && (
              <div className="mt-6 text-right border-t border-gray-200 pt-4">
                <p className="text-lg font-semibold text-gray-900">
                  Total: <span className="text-orange-600">₹{totalPrice}</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorWait;
