// components/PersonalDetails.js
import React, { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaSave, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GetUser from "../../backend/authentication/getuser";
import RegisterUser from "../../backend/authentication/register";
import Colors from "../../core/constant";

const PersonalDetails = () => {
  const navigate = useNavigate();
  const number = localStorage.getItem("userPhone") || "";
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fields = [
    {
      label: "Name",
      key: "Fullname",
      type: "text",
      editable: true,
      required: true,
    },
    { label: "Mobile No.", key: "PhoneNumber", type: "text", editable: false },
    { label: "Email Id", key: "Email", type: "email", editable: true },
    { label: "Gender", key: "Gender", type: "select", editable: true },
    { label: "Date of Birth", key: "DOB", type: "date", editable: true },
  ];

  /* ───── FETCH USER DATA ───── */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await GetUser(number);
        if (userData.length > 0) {
          setUserDetails(userData[0]);
          setEditedDetails(userData[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (number) fetchUser();
  }, [number]);

  /* ───── DETECT MOBILE ───── */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ───── EDIT HANDLERS ───── */
  const handleEditClick = () => {
    setEditedDetails(userDetails);
    setIsEditing(true);
  };

  const handleInputChange = (key, value) => {
    setEditedDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const required = fields.filter((f) => f.required);
    const empty = required.filter((f) => !editedDetails[f.key]?.trim());
    if (empty.length > 0) {
      alert(
        `Please fill all required fields: ${empty
          .map((e) => e.label)
          .join(", ")}`
      );
      return;
    }

    try {
      const res = await RegisterUser(
        "",
        "Edit Profile",
        editedDetails.Fullname,
        number,
        editedDetails.Email,
        editedDetails.Gender,
        editedDetails.DOB
      );

      if (res) {
        alert("User details updated successfully!");
        setUserDetails(editedDetails);
        setIsEditing(false);
      } else {
        alert("Failed to update. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleCancel = () => {
    setEditedDetails(userDetails);
    setIsEditing(false);
  };

  return (
    <div className="">
      {/* ───── MOBILE HEADER (Fixed) ───── */}
      {/* {isMobile && (
        <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <h1
                className={`text-xl font-bold bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} bg-clip-text text-transparent`}
              >
                Personal Details
              </h1>
            </div>
          </div>
        </header>
      )} */}

      {/* ───── DESKTOP HEADER (Sticky) ───── */}
      {/* {!isMobile && (
        <header className="hidden md:sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <h1
              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${Colors.gradientFrom} ${Colors.gradientTo} bg-clip-text text-transparent text-center`}
            >
              Personal Details
            </h1>
          </div>
        </header>
      )} */}

      {/* ───── MAIN CONTENT ───── */}
      <main className="pt-[10px] md:pt-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent md:p-8"
        >
          {!isEditing ? (
            /* ───── VIEW MODE ───── */
            <>
              <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-20 mb-6 pb-4 border-b border-gray-200">
                <h3
                  className={`text-xl md:text-2xl font-semibold ${Colors.textGrayDark}`}
                >
                  Personal Details
                </h3>
                <button
                  onClick={handleEditClick}
                  className={`flex items-center gap-2 px-[15px] py-[1px] rounded-lg font-medium bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} text-white hover:opacity-90 transition`}
                >
                  <FaEdit /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map((item) => (
                  <div
                    key={item.key}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition"
                  >
                    <p
                      className={`text-xs font-semibold ${Colors.textGray} uppercase tracking-wider`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`mt-2 text-base font-medium ${Colors.textGrayDark}`}
                    >
                      {item.key === "PhoneNumber"
                        ? `+91 ${number}`
                        : userDetails[item.key] || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ───── EDIT MODE ───── */
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                <h3
                  className={`text-xl md:text-2xl font-semibold ${Colors.textGrayDark}`}
                >
                  Edit Personal Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <label
                      className={`block text-sm font-semibold ${Colors.textGray} uppercase tracking-wider`}
                    >
                      {item.label}{" "}
                      {item.required && <span className="text-red-500">*</span>}
                    </label>

                    {item.editable === false ? (
                      <div className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg border border-gray-300">
                        +91 {number}
                      </div>
                    ) : item.type === "select" ? (
                      <select
                        value={editedDetails[item.key] || ""}
                        onChange={(e) =>
                          handleInputChange(item.key, e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm text-base"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type={item.type}
                        value={editedDetails[item.key] || ""}
                        onChange={(e) =>
                          handleInputChange(item.key, e.target.value)
                        }
                        placeholder={item.label}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm text-base"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center flex flex-row gap-2">
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium bg-gradient-to-r ${Colors.primaryFrom} ${Colors.primaryTo} text-white hover:opacity-90 transition shadow-lg`}
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PersonalDetails;
