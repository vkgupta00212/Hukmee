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

    // fallback to calculate total
    const finalAmountRupees =
      typeof amount === "number" && !isNaN(amount) && amount > 0
        ? amount
        : calculateTotal();

    if (!finalAmountRupees || finalAmountRupees <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Try again later.");
      return;
    }

    const paise = Math.round(finalAmountRupees * 100);
    const description = `${title} on ${selectedSlot?.day?.label || ""} ${
      selectedSlot?.day?.date || ""
    } at ${selectedSlot?.time || ""}`;

    const options = {
      key: "rzp_live_sdP67bgbbdrRid", // ✅ replace with your test key if needed
      amount: paise,
      currency: "INR",
      name: "WePretiffy",
      description,
      image: "/logo.png",
      handler: async function (response) {
        try {
          alert(
            `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
          );

          if (!orderId) {
            alert("❌ No OrderID found, cannot update order.");
            return;
          }

          // ✅ Update all fetched orders
          for (const orderItem of orders) {
            await UpdateOrder({
              OrderID: orderItem.OrderID,
              UserID: orderItem.UserID,
              OrderType: orderItem.OrderType,
              ItemImages: "",
              ItemName: orderItem.ItemName,
              Price: orderItem.Price,
              Quantity: orderItem.Quantity,
              Address: selectedAddress?.FullAddress || "",
              Slot: `${selectedSlot?.day?.label} ${selectedSlot?.time}`,
              SlotDatetime: `${selectedSlot?.day?.date} ${selectedSlot?.time}`,
            });
          }

          alert("📝 Order Updated Successfully!");
        } catch (err) {
          console.error("UpdateOrder Error:", err);
          alert(
            "❌ Payment done, but order update failed. Please contact support."
          );
        }
      },
      prefill: {
        name: selectedAddress?.Name || "Customer",
        email: selectedAddress?.Email || "customer@example.com",
        contact:
          selectedAddress?.Phone || localStorage.getItem("userPhone") || "",
      },
      theme: { color: "#4f46e5" },
    };

    try {
      setLoading(true);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Error opening payment gateway. Try again.");
    } finally {
      setLoading(false);
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
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
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
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
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
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
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
