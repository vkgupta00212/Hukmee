// components/MyOrder.js
import React, { useState, useEffect } from "react";
import GetOrders from "../../backend/order/getorders";
import Colors from "../../core/constant";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const UserID = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await GetOrders(UserID, "Accepted"); 
        console.log("Fetched Orders:", data);
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
      setIsLoading(false);
    };

    if (UserID) fetchOrders();
  }, [UserID]);

  return (
    <div className={`${Colors.bgGray} py-10`}>
      {isLoading ? (
        <div className={`text-center ${Colors.primaryFrom} font-semibold`}>
          Loading orders...
        </div>
      ) : (
        <OrderDetails orders={orders} />
      )}
    </div>
  );
};

export default MyOrder;

const OrderDetails = ({ orders }) => {
  const [filter, setFilter] = useState("All");

  const headers = [
    "ID",
    "OrderID",
    "UserID",
    "OrderType",
    "ItemImages",
    "ItemName",
    "Price",
    "Quantity",
    "Address",
    "Slot",
    "SlotDatetime",
    "OrderDatetime",
    "Status",
  ];

  // 🔽 Filtered order list
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.Status === filter);

  return (
    <div
      className={`max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border ${Colors.borderGray}`}
    >
      {/* 🔹 Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4">
        <h2
          className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${Colors.gradientFrom} ${Colors.gradientTo} bg-clip-text text-transparent`}
        >
          Order Details
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`border ${Colors.borderGray} rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500`}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${Colors.tableHeadBg}`}>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={`px-6 py-3 text-left text-xs font-medium ${Colors.tableHeadText} uppercase tracking-wider`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className={`px-6 py-4 text-center ${Colors.textGray}`}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.ID} className="hover:bg-gray-50 transition">
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.ID}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.OrderID}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.UserID}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.OrderType}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.ItemImages ? (
                      <img
                        src={order.ItemImages}
                        alt={order.ItemName}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Image+Not+Found";
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.ItemName}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    ₹{order.Price}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.Quantity}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.Address || "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.Slot || "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.SlotDatetime || "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${Colors.textGrayDark}`}
                  >
                    {order.OrderDatetime
                      ? new Date(order.OrderDatetime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.Status === "Pending"
                          ? `${Colors.pendingBg} ${Colors.pendingText}`
                          : order.Status === "Declined"
                          ? `${Colors.dangerBg} ${Colors.dangerText}`
                          : `${Colors.successBg} ${Colors.successText}`
                      }`}
                    >
                      {order.Status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );     
};
