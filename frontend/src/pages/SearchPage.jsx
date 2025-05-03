/* eslint-disable no-unused-vars */
import { useState, useRef, useMemo } from "react";
import { Search, Users, Globe, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Reload } from "../components/Reload/Reload";
import { CountryCard } from "../components/CountryCard";
import Loader from "../components/reload/Loader";
import { useDetailedCountries } from "../app/queries/useAllCountries";

export const SearchPage = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: countries, isLoading, error } = useDetailedCountries();

  const [filteredCountries, setFilteredCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [sortOption, setSortOption] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 12;

  const searchInputRef = useRef(null);

  const sortCountries = (countriesToSort, option) => {
    switch (option) {
      case "name":
        return [...countriesToSort].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
      case "population":
        return [...countriesToSort].sort((a, b) => b.population - a.population);
      case "area":
        return [...countriesToSort].sort((a, b) => b.area - a.area);
      default:
        return countriesToSort;
    }
  };

  useMemo(() => {
    if (countries) {
      let results = [...countries];

      if (search) {
        results = results.filter(
          (country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase()) ||
            (country.capital &&
              country.capital[0] &&
              country.capital[0].toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (selectedRegion !== "All") {
        results = results.filter(
          (country) => country.region === selectedRegion
        );
      }

      results = sortCountries(results, sortOption);

      setFilteredCountries(results);
      setCurrentPage(1);
    }
  }, [search, selectedRegion, sortOption, countries]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current.focus();
  };

  const regions = [
    "All",
    ...new Set(countries ? countries.map((country) => country.region) : []),
  ].filter(Boolean);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  if (error) {
    return <Reload />;
  }
  return (
    <div className="min-h-screen pt-36">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-extrabold  mb-3 text-primary dark:text-white">
            World Explorer
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto dark:text-gray-300">
            Discover countries and their details from around the globe
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative max-w-3xl mx-auto mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-primary dark:text-dark" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by country or capital..."
              value={search}
              onChange={handleSearch}
              className="pl-12 pr-12 py-4 w-full rounded-full border-0 bg-white shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors">
                  ✕
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-3 max-w-3xl mx-auto">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={18} className="text-primary dark:text-dark" />
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-lg shadow-md border-0 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white appearance-none"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region === "All" ? "All Regions" : region}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="relative md:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-primary dark:text-dark" />
                </div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between py-3 pl-10 pr-4 rounded-lg shadow-md border-0 bg-white text-left"
                >
                  <span className="text-gray-700">
                    Sort by:{" "}
                    <span className="font-medium capitalize">{sortOption}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform text-gray-400 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border-0 overflow-hidden">
                  {["name", "population", "area"].map((option) => (
                    <button
                      key={option}
                      className="block w-full text-left px-4 py-3 hover:bg-blue-50 capitalize border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSortOption(option);
                        setShowDropdown(false);
                      }}
                    >
                      <span
                        className={`${
                          sortOption === option
                            ? "text-blue-500 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-center"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <span className="inline-flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
              ✓ Found {filteredCountries.length} countries
            </span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentCountries.map((country, index) => (
                <CountryCard country={country} key={index} />
              ))}
            </div>

            {filteredCountries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-12 flex justify-center"
              >
                <div className="flex items-center ">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-10 w-10 rounded-full disabled:opacity-50 hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${
                        currentPage === 1 ? "text-gray-300" : "text-blue-500"
                      }`}
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 w-10 flex items-center justify-center rounded-full mx-1 hover:scale-105 transition-all ${
                          currentPage === pageNum
                            ? "bg-primary dark:bg-accent text-white shadow-md"
                            : "text-gray-700 hover:bg-primary/10 dark:hover:bg-white/10"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-10 w-10 rounded-full disabled:opacity-50 hover:bg-primary/50  transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${
                        currentPage === totalPages
                          ? "text-gray-300 dark:text-gray-500"
                          : "dark:text-white text-black"
                      }`}
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            {filteredCountries.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 max-w-md mx-auto"
              >
                <div className="relative mb-6 mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full bg-blue-100 animate-ping opacity-75"></div>
                  <Search size={36} className="text-blue-500 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No countries found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any countries matching your current filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedRegion("All");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1 font-medium"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
