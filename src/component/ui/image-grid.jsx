import React from "react";
import MainImage from "../../assets/hukmeemain.jpg";

const ImageGrid = () => {
  return (
    <div className="flex items-center justify-center">
      <img
        src={MainImage}
        alt="Women's Salon"
        className="w-full h-full max-h-full object-cover rounded-[5px]  border border-gray-200"
      />
    </div>
  );
};

export default ImageGrid;
