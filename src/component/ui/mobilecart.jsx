// src/components/cart/MobileCartSummary.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Colors from "../../core/constant";
import GetOrder from "../../backend/order/getorderid";
import ShowOrders from "../../backend/order/showorder";

const MobileCartSummary = () => {
  const [orders, setOrders] = useState([]); // Normal cart (Pending)
  const [pending1, setPending1] = useState([]); // Reorder suggestions (Pending1)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const UserID = localStorage.getItem("userPhone");

  // Fetch normal cart
  const fetchCart = useCallback(async () => {
    if (!UserID) return;
    try {
      const data = await GetOrder(UserID, "Pending");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setOrders([]);
    }
  }, [UserID]);

  // Fetch reorder suggestions
  const fetchPending1 = useCallback(async () => {
    if (!UserID) return;
    try {
      const data = await ShowOrders({
        orderid: "",
        UserID,
        VendorPhone: "",
        Status: "Pending1",
      });
      setPending1(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch pending1:", err);
      setPending1([]);
    }
  }, [UserID]);

  // Fetch both on mount + when user changes
  useEffect(() => {
    if (!UserID) {
      setOrders([]);
      setPending1([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCart(), fetchPending1()]);
      setLoading(false);
    };
    load();
  }, [UserID, fetchCart, fetchPending1]);

  // Determine which items to show
  const hasReorder = pending1.length > 0;
  const itemsToShow = hasReorder ? pending1 : orders;

  // Total quantity
  const totalItemsQty = useMemo(() => {
    return itemsToShow.reduce(
      (sum, item) => sum + Number(item.Quantity || 0),
      0
    );
  }, [itemsToShow]);

  // Button text
  const buttonText = hasReorder
    ? `Update Items (${totalItemsQty} Item${totalItemsQty !== 1 ? "s" : ""})`
    : `Proceed (${totalItemsQty} Item${totalItemsQty !== 1 ? "s" : ""})`;

  // Click handler
  const handleClick = () => {
    navigate("/paymentpage"); // Always go to CartPage
  };

  // Don't render if empty or loading
  if (loading || totalItemsQty === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-1 pb-2 bg-transparent border-t-2 border-gray-200 shadow-2xl pointer-events-none">
      <div className="pointer-events-auto">
        <button
          onClick={handleClick}
          className={`
            w-full flex items-center justify-between 
            bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} 
            text-white px-5 py-3 rounded-xl 
            font-bold text-lg tracking-wider
            shadow-2xl hover:shadow-3xl active:scale-98 
            transition-all duration-200
            border border-white/20 select-none
          `}
        >
          {/* Left: Total Items */}
          <span className="text-[15px] font-semibold">
            {totalItemsQty} Item{totalItemsQty !== 1 ? "s" : ""}
          </span>

          {/* Right: Action + Arrow */}
          <span className="flex text-[15px] items-center gap-3 font-semibold">
            {buttonText}
            <span className="text-l">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileCartSummary;
