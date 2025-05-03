import React from "react";

export const Reload = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <CircleX size={24} />
      <div className="text-red-500 text-xl mb-2">Error loading countries</div>
      <p className="text-gray-700">{error}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
};
