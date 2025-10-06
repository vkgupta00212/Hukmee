import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import Colors from "../../core/constant";

// Individual color card
const SelectColorCardItem = ({ color, label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105"
    >
      <Card
        className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[60px] lg:h-[60px] rounded-xl overflow-hidden border flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300
        ${
          isActive
            ? `${Colors.bgGray} border-[#FA7D09] ring-2 ring-[#E56A00]`
            : `bg-white ${Colors.borderGray} hover:border-[#FA7D09]`
        }`}
      >
        <CardContent className="p-0 flex items-center justify-center w-full h-full">
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: color }}
          ></div>
        </CardContent>
      </Card>
      <span
        className={`text-[10px] md:text-[11px] lg:text-[12px] font-medium text-center text-gray-800 leading-tight max-w-[80px] group-hover:${Colors.tableHeadText} transition-colors duration-300`}
      >
        {label}
      </span>
    </div>
  );
};

// Main component
const SelectColorCardSection = () => {
  const dummyColors = [
    { color: "red", label: "Red" },
    { color: "blue", label: "Blue" },
    { color: "green", label: "Green" },
    { color: "yellow", label: "Yellow" },
    { color: "pink", label: "Pink" },
    { color: "purple", label: "Purple" },
    { color: "orange", label: "Orange" },
    { color: "cyan", label: "Cyan" },
  ];

  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <div className="w-full sm:w-[350px] md:w-[300px] lg:w-[280px] mx-auto sm:mx-0 bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h1
        className={`text-[22px] md:text-[26px] lg:text-[28px] font-bold mb-4 ${Colors.textGrayDark}`}
      >
        Choose a Color
      </h1>

      <div className="grid grid-cols-4 sm:grid-cols-3 gap-3">
        {dummyColors.map((item, index) => (
          <SelectColorCardItem
            key={index}
            color={item.color}
            label={item.label}
            isActive={selectedColor === item.color}
            onClick={() => setSelectedColor(item.color)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectColorCardSection;
