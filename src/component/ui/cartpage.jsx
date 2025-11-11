// src/components/cart/CartPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GetOrder from "../../backend/order/getorderid";
import DeleteOrder from "../../backend/order/deleteorder";
import UpdateQuantity from "../../backend/order/updateorder";
import Colors from "../../core/constant";
import ShowOrders from "../../backend/order/showorder";

const CartPage = () => {
  const [orders, setOrders] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [pending1, setPending1] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const UserID = localStorage.getItem("userPhone");
  const navigate = useNavigate();

  // Fetch cart orders
  const fetchCartOrders = useCallback(async () => {
    if (!UserID) return;
    setIsCartLoading(true);
    try {
      const data = await GetOrder(UserID, "Pending");
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsCartLoading(false);
    }
  }, [UserID]);

  useEffect(() => {
    if (!UserID) return;
    const fetchPendingOrders = async () => {
      setPendingLoading(true);
      try {
        const data = await ShowOrders({
          orderid: "",
          UserID,
          VendorPhone: "",
          Status: "Pending1", // ✅ make sure backend supports this
        });
        setPending1(data || []);
        console.log("✅ Pending orders:", data);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      } finally {
        setPendingLoading(false);
      }
    };

    fetchPendingOrders();
  }, [UserID]);

  useEffect(() => {
    fetchCartOrders();
  }, [fetchCartOrders]);

  // Remove item
  const handleRemove = async (id) => {
    setDeletingItemId(id);
    setOrders((prev) => prev.filter((item) => item.ID !== id));
    try {
      await DeleteOrder(id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingItemId(null);
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (orderId, newQty) => {
    const orderToUpdate = orders.find((item) => item.OrderID === orderId);
    if (!orderToUpdate) return;

    // Optimistic update
    setOrders((prev) =>
      prev.map((item) =>
        item.OrderID === orderId ? { ...item, Quantity: newQty } : item
      )
    );

    setUpdatingItemId(orderId);

    try {
      await UpdateQuantity({
        OrderID: orderToUpdate.OrderID,
        UserID: orderToUpdate.UserID || UserID,
        OrderType: orderToUpdate.OrderType || "Pending",
        ItemImages: "",
        ItemName: "",
        Price: "",
        Quantity: newQty,
        Address: "",
        Slot: "",
        SlotDatetime: "",
        OrderDatetime: "",
      });

      // artificial delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      console.error("Update quantity failed:", err);
      setOrders((prev) =>
        prev.map((item) =>
          item.OrderID === orderId
            ? { ...item, Quantity: orderToUpdate.Quantity }
            : item
        )
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Totals
  const total = useMemo(
    () =>
      orders.reduce(
        (acc, item) => acc + Number(item.Price) * Number(item.Quantity),
        0
      ),
    [orders]
  );

  const totalDiscount = useMemo(
    () =>
      orders.reduce((acc, item) => {
        const original = Number(item.Price) || 0;
        const discounted = Number(item.DiscountPrice) || original;
        const qty = Number(item.Quantity) || 1;
        return acc + (original - discounted) * qty;
      }, 0),
    [orders]
  );

  const handleProceed = () => {
    navigate("/paymentpage", {
      state: {
        cartItems: orders,
        total,
        totalDiscount,
      },
    });
  };

  const isMobile = window.innerWidth < 640;

  return (
    <div className="w-full md:w-80 lg:w-96 mx-auto bg-white rounded-2xl shadow-lg overflow-hidden font-sans">
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b ${Colors.borderGray}`}>
        <h2
          className={`text-xl sm:text-2xl font-bold ${Colors.textGrayDark} mb-4 sm:mb-6`}
        >
          Your Cart
        </h2>

        {/* 🛒 Pending Orders (Normal Cart) */}
        <div className="mb-8">
          {isCartLoading ? (
            <div className="flex justify-center items-center py-4">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${Colors.primaryFrom.replace(
                  "from",
                  "border"
                )}`}
              ></div>
              <p className={`ml-3 ${Colors.textMuted}`}>Loading pending...</p>
            </div>
          ) : (
            orders.map((item) => (
              <div
                key={item.ID}
                className={`flex justify-between items-start mb-4 pb-4 border-b ${Colors.divideGray}`}
              >
                {/* Left */}
                <div className="flex-grow pr-3">
                  <p
                    className={`text-sm sm:text-base font-semibold ${Colors.textGrayDark}`}
                  >
                    {item.ItemName}
                  </p>
                  <button
                    onClick={() => handleRemove(item.ID)}
                    disabled={deletingItemId === item.ID}
                    className={`flex items-center bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent text-sm mt-2`}
                  >
                    <Trash2 size={14} className="mr-1" />
                    {deletingItemId === item.ID ? "Removing..." : "Remove"}
                  </button>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.OrderID,
                          Math.max(1, Number(item.Quantity) - 1)
                        )
                      }
                      disabled={
                        Number(item.Quantity) <= 1 ||
                        updatingItemId === item.OrderID
                      }
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    {updatingItemId === item.OrderID ? (
                      <div className="w-6 text-center">
                        <div
                          className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 ${Colors.primaryFrom.replace(
                            "from",
                            "border"
                          )}`}
                        />
                      </div>
                    ) : (
                      <span className="w-6 text-center">{item.Quantity}</span>
                    )}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.OrderID,
                          Number(item.Quantity) + 1
                        )
                      }
                      disabled={updatingItemId === item.OrderID}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p
                    className={`text-base sm:text-lg font-bold bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent mt-2`}
                  >
                    ₹{(Number(item.Price) * Number(item.Quantity)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🧾 Pending1 Orders */}
        <div>
          {pendingLoading ? (
            <div className="flex justify-center items-center py-4">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${Colors.primaryFrom.replace(
                  "from",
                  "border"
                )}`}
              ></div>
              <p className={`ml-3 ${Colors.textMuted}`}>Loading pending1...</p>
            </div>
          ) : (
            pending1.map((item) => (
              <div
                key={item.ID}
                className={`flex justify-between items-start mb-4 pb-4 border-b ${Colors.divideGray}`}
              >
                <div className="flex-grow pr-3">
                  <p
                    className={`text-sm sm:text-base font-semibold ${Colors.textGrayDark}`}
                  >
                    {item.ItemName}
                  </p>
                  <button
                    onClick={() => handleRemove(item.ID)}
                    disabled={deletingItemId === item.ID}
                    className={`flex items-center bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent text-sm mt-2`}
                  >
                    <Trash2 size={14} className="mr-1" />
                    {deletingItemId === item.ID ? "Removing..." : "Remove"}
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`text-base sm:text-lg font-bold bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent mt-2`}
                  >
                    ₹{Number(item.Price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Summary */}
      {orders.length > 0 && (
        <div className="w-full p-4 sm:p-6 bg-white border-t border-gray-200">
          <div className="mb-4">
            <div
              className={`flex justify-between text-base sm:text-lg font-semibold ${Colors.textGrayDark}`}
            >
              <span>Subtotal</span>
              <span>
                ₹
                {orders
                  .reduce(
                    (acc, item) =>
                      acc + Number(item.Price) * Number(item.Quantity),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={handleProceed}
            className={`w-full flex items-center justify-between bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} ${Colors.textWhite} px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow hover:opacity-90`}
          >
            <span className="text-base sm:text-lg font-semibold">Proceed</span>
            <span className="text-base sm:text-lg font-semibold">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
