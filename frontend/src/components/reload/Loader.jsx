import React from "react";
import image from "../../assets/Asset 11.png";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white/80 dark:bg-dark/80 rounded-lg ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-primary dark:border-white border-opacity-50 mt-10"></div>

      <div className="absolute flex flex-col items-center space-x-2">
        <img src={image} className="h-[30px]" />
        <span className="text-2xl font-bold text-primary dark:text-white group-hover:text-primary transition-colors duration-200">
          TAZA
        </span>
      </div>
      <p className="ml-4 text-md text-gray-700 font-bold dark:text-white">
        Loading...
      </p>
    </div>
  );
}
