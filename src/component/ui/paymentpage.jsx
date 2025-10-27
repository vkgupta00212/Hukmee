import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PaymentCard from "./paymentCard";
import PaymentCard2 from "./paymentCard2";
import PaymentCardButton from "./paymentCardButton";
import AddressFormCard from "./addressCard";
import SlotCard from "./slotCard";
import { motion, AnimatePresence } from "framer-motion";
import UpdateOrder from "../../backend/order/updateorder";
import GetOrder from "../../backend/order/getorderid";
import Colors from "../../core/constant";
import AssignLeads from "../../backend/order/assignleads";

const PaymentPage = () => {
  const location = useLocation();
  const {
    cartItems: incomingCartItems = [],
    total = 0,
    discountfee = 0,
    title = "Selected Package",
  } = location.state || {};

  const itemTotal = Number(total) || 0;
  const navigate = useNavigate();

  const calculateTotal = () => {
    const rawTotal = itemTotal;
    return rawTotal > 0 ? rawTotal : 0;
  };

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("isLoggedIn") === "true"
      : false
  );
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState(
    Array.isArray(incomingCartItems) ? incomingCartItems : []
  );

  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await GetOrder(UserID, "Pending");
        console.log("Fetched orders:", res);

        if (Array.isArray(res) && res.length > 0) {
          setOrders(res); // store full array
          setOrderId(res[0].OrderID); // use first order's OrderID
        } else {
          setOrders([]);
          setOrderId(null);
        }
      } catch (err) {
        console.error("Error fetching order id:", err);
      }
    };
    fetchOrders();
  }, [UserID]);

  const handleRazorpayPayment = async (amount) => {
    if (!isLoggedIn) {
      alert("Please login to continue.");
      return;
    }

    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      setShowAddressModal(true);
      return;
    }

    if (!selectedSlot) {
      alert("Please select a slot before proceeding.");
      setShowSlotModal(true);
      return;
    }

    if (!orderId) {
      alert("Order ID not available. Try again.");
      return;
    }

    try {
      // ✅ Call AssignLeads API
      const response = await AssignLeads(orderId);
      console.log("AssignLeads API Response:", response);

      if (
        response?.message === "Leads Assigned Successfully" ||
        response === "Leads Assigned Successfully"
      ) {
        alert("Leads assigned successfully!");
        navigate("/vendorwait", { state: { cartItems } });
      } else {
        alert("Failed to assign leads. Please try again.");
      }
    } catch (error) {
      console.error("Error during AssignLeads:", error);
      alert("Something went wrong while assigning leads.");
    }
  };

  const goBack = () => {
    // Check if user can go back in history
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // go back in stack
    } else {
      navigate("/"); // fallback route
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-start px-4 py-3 sm:px-6">
            <button
              onClick={goBack}
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
            <h2
              className={`text-xl sm:text-3xl font-bold bg-${Colors.primaryMain} bg-clip-text text-transparent`}
            >
              Checkout
            </h2>
          </div>
        </div>
        <div className="pt-[35px] mb-[10px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Confirm details & complete payment
              </p>
              {orderId && (
                <p className="text-xs text-green-600 mt-1">
                  Current Order ID: {orderId}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PaymentCard
              onSelectAddress={() => setShowAddressModal(true)}
              onSelectSlot={() => setShowSlotModal(true)}
              onProceedPayment={(amt, coupon) =>
                handleRazorpayPayment(amt, coupon)
              }
              selectedAddress={selectedAddress}
              selectedSlot={selectedSlot}
              calculateTotal={calculateTotal}
            />
          </div>

          <div className="flex flex-col gap-4 md:mt-[40px]">
            <PaymentCard2
              cartItems={cartItems}
              calculateTotal={calculateTotal}
              setCartItems={setCartItems}
            />
            <PaymentCardButton
              itemTotal={itemTotal}
              calculateTotal={calculateTotal}
              onProceed={(amount, coupon) =>
                handleRazorpayPayment(amount, coupon)
              }
              loading={loading}
            />
          </div>
        </div>

        {showAddressModal && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-5"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.98 }}
              >
                <AddressFormCard
                  onSelectAddress={(address) => {
                    // normalize address
                    const formattedAddress = {
                      Name: address.Name || address.name || "",
                      Email: address.Email || address.email || "",
                      Phone: address.Phone || address.phone || "",
                      FullAddress:
                        address.FullAddress ||
                        `${address.Address || address.address || ""}, ${
                          address.City || address.city || ""
                        }, ${address.State || address.state || ""} - ${
                          address.PinCode || address.pincode || ""
                        }`,
                    };
                    setSelectedAddress(formattedAddress);
                    setShowAddressModal(false);
                  }}
                  onClose={() => setShowAddressModal(false)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {showSlotModal && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-5"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.98 }}
              >
                <SlotCard
                  onSelectSlot={(slot) => {
                    setSelectedSlot(slot);
                    setShowSlotModal(false);
                  }}
                  onClose={() => setShowSlotModal(false)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowSlotModal(false)}
                    className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
