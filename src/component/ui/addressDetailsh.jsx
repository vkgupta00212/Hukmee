import React, { useEffect, useState } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdDelete, MdLocationOn } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import GetAddress from "../../backend/address/getaddress";
import Colors from "../../core/constant";
import AddressFormCard from "./addressCard";
import DeleteAddress from "../../backend/address/deleteaddress";

const AddressList = ({ onRefresh }) => {
  const [addresses, setAddresses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const phone = localStorage.getItem("userPhone") || "";

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await GetAddress(phone);
      setAddresses(data || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Toggle expand
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Edit & Delete handlers
  const handleEditClick = (address) => {
    console.log("Edit address:", address);
    // Open edit modal here
  };

  const handleDeleteClick = (address) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      DeleteAddress(address.id)
        .then((result) => {
          if (result.success) {
            alert("✅ Address deleted successfully!");
            onRefresh?.(); // ✅ tell parent to reload section
          } else {
            alert("❌ Failed to delete address: " + result.message);
          }
        })
        .catch((error) => {
          console.error("Delete address error:", error);
          alert("An error occurred while deleting the address");
        });
    }
  };

  const onAddSuccess = () => {
    setShowAddForm(false);
    onRefresh?.(); // ✅ refresh section after adding
  };

  const onAddCancel = () => {
    setShowAddForm(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div
          className={`animate-spin rounded-full h-10 w-10 border-b-2 border-${Colors.primaryMain}`}
        />
        <span className="ml-3 text-gray-600">Loading addresses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button - Always visible when list has items */}
      {addresses.length > 0 && !showAddForm && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className={`bg-${Colors.primaryMain} text-white py-2 px-5 rounded-lg hover:bg-orange-600 transition flex items-center gap-2 shadow-md`}
          >
            <MdLocationOn className="text-lg" />
            Add Address
          </button>
        </div>
      )}

      {/* Animated Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <AddressFormCard onSuccess={onAddSuccess} onCancel={onAddCancel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <MdLocationOn className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-lg text-gray-600 font-medium">
            No addresses found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Add your first address to get started!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`mt-4 bg-${Colors.primaryMain} text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition shadow-md`}
          >
            Add Address
          </button>
        </div>
      )}

      {/* Address Cards */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id || index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Compact Row */}
              <div
                className="p-5 cursor-pointer flex items-center justify-between"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MdLocationOn
                        className={`text-${Colors.primaryMain} text-xl`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {address.Name || "Unnamed"}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {address.City}
                      {address.PinCode ? `, ${address.PinCode}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(address);
                    }}
                    className={`p-2 text-${Colors.primaryMain} hover:bg-orange-50 hover:cursor-pointer rounded-lg transition-colors`}
                    aria-label="Edit address"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(address);
                    }}
                    className={`p-2 text-${Colors.primaryMain} hover:bg-orange-50 hover:cursor-pointer rounded-lg transition-colors`}
                    aria-label="Delete address"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                  <div className="p-2 text-gray-500">
                    {expandedIndex === index ? (
                      <FaChevronUp className="text-lg" />
                    ) : (
                      <FaChevronDown className="text-lg" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-gray-200 bg-gray-50 px-5 py-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Full Name", value: address.Name },
                        { label: "Phone", value: address.Phone },
                        { label: "Address", value: address.Address },
                        { label: "City", value: address.City },
                        { label: "Pin Code", value: address.PinCode },
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field.label}
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900 break-words">
                            {field.value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
