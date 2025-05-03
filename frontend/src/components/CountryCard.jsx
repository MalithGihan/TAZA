import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, MessageSquare } from "lucide-react";

export const CountryCard = ({ country, index }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getCurrencies = (currencyObj) => {
    if (!currencyObj) return "N/A";
    return Object.values(currencyObj)
      .map((curr) => curr.name)
      .join(", ");
  };
  return (
    <motion.div
      key={country.cca3}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="font-serif bg-white dark:bg-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={country.flags.png || "/api/placeholder/400/320"}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-0 right-0 bg-black/30 backdrop-blur-sm m-3 px-3 py-1 rounded-full text-xs font-medium text-white ">
          {country.region}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-3xl font-bold text-white drop-shadow-sm">
            {country.name.common}
          </h2>
          {country.capital?.[0] && (
            <div className="flex items-center mt-1 text-white/90">
              <MapPin size={14} className="mr-1" />
              <span className="text-sm">{country.capital[0]}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between mb-4 text-center">
          <div className="flex-1 border-r border-gray-100">
            <div className="text-xl font-bold text-blue-600">
              {formatNumber(country.population)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-300">
              Population
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-blue-600">
              {country.area
                ? `${formatNumber(Math.round(country.area))}`
                : "N/A"}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide dark:text-gray-300">
              km²
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Region
              </div>
              <div className="text-sm font-medium">
                {country.region}{" "}
                {country.subregion ? `(${country.subregion})` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageSquare size={16} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Languages
              </div>
              <div
                className="text-sm font-medium truncate"
                title={
                  country.languages
                    ? Object.values(country.languages).join(", ")
                    : "N/A"
                }
              >
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600 w-4 h-4"
              >
                <circle cx="12" cy="12" r="8"></circle>
                <line x1="16" y1="12" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="8" y1="12" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Currency
              </div>
              <div className="text-sm font-medium">
                {country.currencies ? getCurrencies(country.currencies) : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
