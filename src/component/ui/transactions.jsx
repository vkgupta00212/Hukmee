import React, { useState, useEffect } from "react";
import GetWallet from "../../backend/getwallet/getwallet";
import GetTransaction from "../../backend/gettransaction/gettransaction";
import Colors from "../../core/constant";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const phone = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await GetTransaction(phone);
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      }
      setIsLoading(false);
    };
    if (phone) fetchTransactions();
  }, [phone]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await GetWallet(phone);
        setWallet(data || []);
      } catch (error) {
        console.error("Error fetching wallet:", error);
        setWallet([]);
      }
    };
    if (phone) fetchWallet();
  }, [phone]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`min-h-screen ${Colors.bgGrayLight} flex justify-center p-4 sm:p-6 lg:p-8`}
    >
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Wallet Section */}
        <div
          className={`p-6 sm:p-8 border-b ${Colors.borderGray} flex justify-between items-center`}
        >
          <h3
            className={`${Colors.textGrayDark} text-xl sm:text-2xl font-bold`}
          >
            Wallet
          </h3>
          <span className="text-xl sm:text-2xl font-semibold text-orange-600">
            ₹{wallet[0]?.WalletBalance || 0}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`${Colors.textGrayDark} text-3xl font-extrabold p-6 sm:p-8 border-b ${Colors.borderGray}`}
        >
          Transaction History
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header Row */}
            <thead className={`${Colors.tableHeadBg} ${Colors.tableHeadText}`}>
              <tr>
                <th className="px-4 py-4 sm:px-6 sm:py-5">ID</th>
                <th className="px-4 py-4 sm:px-6 sm:py-5">Transaction ID</th>
                <th className="px-4 py-4 sm:px-6 sm:py-5">Amount</th>
                <th className="px-4 py-4 sm:px-6 sm:py-5">Date</th>
                <th className="px-4 py-4 sm:px-6 sm:py-5">Phone</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className={`${Colors.textGray} text-center py-8`}
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((txn, index) => (
                  <tr
                    key={txn.id || index}
                    className={`${
                      index % 2 === 0
                        ? Colors.tableRowEvenBg
                        : Colors.tableRowOddBg
                    } ${Colors.textGrayDark} border-b ${Colors.borderGray} ${
                      Colors.tableRowHoverBg
                    } transition`}
                  >
                    <td className="px-4 py-4 sm:px-6 sm:py-5">{txn.id}</td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      {txn.Transactionid}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5 font-semibold text-green-600">
                      ₹{parseFloat(txn.TransactionAmt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      {formatDate(txn.DateTime || txn.DateTim)}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">{txn.Phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className={`${Colors.textGray} text-center py-8`}
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
