import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ShowOrders from "../../backend/order/showorder";
import GetVendor from "../../backend/authentication/getvendor";

// Reusable VendorCard component
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
      {/* Title */}
      <h2
        className={`text-3xl font-bold text-center mb-6 ${
          isAccepted
            ? "text-green-600"
            : "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
        }`}
      >
        {title}
      </h2>

      {/* Main Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-center text-gray-500 text-sm mt-4 animate-pulse">
            Finding vendor, please wait for a moment...
          </p>
        </div>
      ) : (
        <>
          {/* Vendor Details Section - Only after acceptance */}
          {isAccepted && (
            <div className="flex flex-col">
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Vendor Details
                  {isVendorLoading && (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></span>
                  )}
                </h3>

                {isVendorLoading ? (
                  <p className="text-sm text-gray-500 italic">
                    Loading vendor info...
                  </p>
                ) : vendorDetails ? (
                  <>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Name:</span>{" "}
                      {vendorDetails.fullname}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {vendorDetails.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {vendorDetails.Address || "Not provided"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-600 italic">
                    Vendor details unavailable
                  </p>
                )}
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex flex-row justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    OTP
                  </h3>
                  <h3>{vendorData[0].OTP}</h3>
                </div>
              </div>
            </div>
          )}

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
              No items in this order.
            </p>
          )}

          {/* Total Price */}
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
  const [cartItems] = useState(
    Array.isArray(incomingCartItems) ? incomingCartItems : []
  );

  const orderId = cartItems[0]?.OrderID || "";

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [vendorAccepted, setVendorAccepted] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isVendorLoading, setIsVendorLoading] = useState(false);

  const VendorPhone = localStorage.getItem("userPhone");

  useEffect(() => {
    if (!VendorPhone) {
      setIsLoading(false);
      return;
    }

    let interval = null;

    const fetchShowOrders = async () => {
      try {
        const res = await ShowOrders({
          orderid: orderId,
          UserID: VendorPhone,
          VendorPhone: "",
          Status: "Done",
        });

        if (Array.isArray(res) && res.length > 0) {
          const doneOrders = res.filter((order) => order.Status === "Done");
          console.log("orders fetched:", doneOrders);

          if (doneOrders.length > 0) {
            // Order accepted
            setVendorAccepted(true);
            setVendorData(doneOrders);
            setIsLoading(false);

            // Stop polling
            if (interval) clearInterval(interval);

            // Fetch vendor details
            const vendorPhone = doneOrders[0].VendorPhone;
            if (vendorPhone && !vendorDetails) {
              setIsVendorLoading(true);
              try {
                const vendorRes = await GetVendor(vendorPhone);
                if (Array.isArray(vendorRes) && vendorRes.length > 0) {
                  setVendorDetails(vendorRes[0]);
                } else {
                  setVendorDetails(null);
                }
              } catch (err) {
                console.log("Failed to fetch vendor details:", err);
                setVendorDetails(null);
              } finally {
                setIsVendorLoading(false);
              }
            }
          } else {
            // Still waiting
            setVendorAccepted(false);
            setVendorData([]);
            setVendorDetails(null);
          }
        } else {
          setVendorAccepted(false);
          setVendorData([]);
          setVendorDetails(null);
        }
      } catch (error) {
        console.error("Error in ShowOrders:", error);
        setVendorAccepted(false);
        setVendorDetails(null);
      } finally {
        if (!vendorAccepted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchShowOrders();

    if (!vendorAccepted) {
      interval = setInterval(fetchShowOrders, 5000);
    }

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [VendorPhone, vendorAccepted, vendorDetails]);

  return (
    <div className="mt-10 min-h-screen bg-gray-100 flex flex-wrap items-start justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8">
      {/* Right - Vendor Status Card */}
      <VendorCard
        title={vendorAccepted ? "Vendor Accepted" : "Finding Vendor"}
        vendorData={vendorData}
        isLoading={isLoading && !vendorAccepted}
        isAccepted={vendorAccepted}
        vendorDetails={vendorDetails}
        isVendorLoading={isVendorLoading}
      />
    </div>
  );
};

export default VendorWait;
