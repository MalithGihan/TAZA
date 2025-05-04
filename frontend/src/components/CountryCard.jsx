import React from "react";
import { motion } from "framer-motion";
import { Clock, Globe, MapPin, MessageSquare } from "lucide-react";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -4,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 "
    >
      <div className="relative h-40">
        <img
          src={country.flags.png || "/api/placeholder/400/320"}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>

        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-white tracking-wide">
          {country.region}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h2 className="text-2xl font-semibold text-white">
            {country.name.common}
          </h2>
          {country.capital?.[0] && (
            <div className="flex items-center mt-1 text-white/90 text-xs">
              <MapPin size={12} className="mr-1" />
              <span>{country.capital[0]}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Population
            </div>
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {formatNumber(country.population)}
            </div>
          </div>

          <div className="flex flex-col items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400">Area</div>
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {country.area
                ? `${formatNumber(Math.round(country.area))} km²`
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md">
              <MessageSquare size={14} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Languages
              </div>
              <div
                className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate"
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

          <div className="flex items-center gap-3">
            <div className="text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-1.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <circle cx="12" cy="12" r="8"></circle>
                <line x1="16" y1="12" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="8" y1="12" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Currency
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {country.currencies ? getCurrencies(country.currencies) : "N/A"}
              </div>
            </div>
          </div>

          {country.subregion && (
            <div className="flex items-center gap-3">
              <div className="text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-md">
                <Globe size={14} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Subregion
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {country.subregion}
                </div>
              </div>
            </div>
          )}

          {country.timezones && country.timezones.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-md">
                <Clock size={14} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Timezone
                </div>
                <div
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate"
                  title={country.timezones[0]}
                >
                  {country.timezones[0]}
                  {country.timezones.length > 1 &&
                    ` +${country.timezones.length - 1} more`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
