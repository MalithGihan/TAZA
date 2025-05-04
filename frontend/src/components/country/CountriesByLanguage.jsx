import React, { useState } from "react";
import { Search, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "../reload/Loader";
import { useCountriesByLanguage } from "../../app/queries/useAllCountries";
import { CountryCard } from "../CountryCard";

export default function CountriesByLanguage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const itemsPerPage = 8;

  const popularLanguages = [
    "English",
    "Spanish",
    "French",
    "Arabic",
    "Chinese",
    "Hindi",
    "Portuguese",
    "Russian",
  ];

  const {
    data: countries = [],
    error,
    isLoading,
  } = useCountriesByLanguage(searchTerm);

  const handleSearch = (term) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setCurrentPage(1);

    if (!searchHistory.includes(term)) {
      setSearchHistory((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  const totalPages = Math.ceil(countries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCountries = countries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="font-serif min-h-screen pt-36 pb-16 justify-center items-center max-w-7xl mx-auto md:px-10 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-primary">
          Explore Countries by Language
        </h1>
        <p className="font-inter text-gray-600 max-w-2xl mx-auto">
          Discover countries around the world where different languages are
          spoken. Enter a language below to find related countries.
        </p>
      </div>

      <div className="p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-blue-500" />
            </div>
            <input
              type="text"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (e.target.value.length > 0) {
                  setShowHistory(true);
                } else {
                  setShowHistory(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value);
                  e.target.blur();
                }
              }}
              placeholder="Type a language (e.g., English, Spanish, French)"
              className="pl-12 pr-4 py-4 w-full rounded-full border border-gray-200 bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-lg"
            />
            {showHistory &&
              (language.length > 0 || searchHistory.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-10">
                  {searchHistory.length > 0 && language.length === 0 && (
                    <div className="p-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                      Recent searches
                    </div>
                  )}

                  {searchHistory
                    .filter((term) =>
                      term.toLowerCase().includes(language.toLowerCase())
                    )
                    .map((term, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700"
                        onClick={() => {
                          setLanguage(term);
                          handleSearch(term);
                        }}
                      >
                        <Search size={16} className="text-gray-400 mr-2" />
                        {term}
                      </div>
                    ))}

                  {language.length > 0 &&
                    popularLanguages
                      .filter(
                        (lang) =>
                          lang.toLowerCase().includes(language.toLowerCase()) &&
                          !searchHistory.find(
                            (h) => h.toLowerCase() === lang.toLowerCase()
                          )
                      )
                      .slice(0, 5)
                      .map((lang, index) => (
                        <div
                          key={`suggestion-${index}`}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700"
                          onClick={() => {
                            setLanguage(lang);
                            handleSearch(lang);
                          }}
                        >
                          <Globe size={16} className="text-gray-400 mr-2" />
                          {lang}
                        </div>
                      ))}
                </div>
              )}
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2 md:w-auto w-full justify-center"
          >
            <Search size={20} />
            <span>Search</span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 flex items-center mr-1">
            Popular:
          </span>
          {popularLanguages.slice(0, 5).map((lang, index) => (
            <button
              key={index}
              onClick={() => {
                setLanguage(lang);
                handleSearch(lang);
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary/20 text-gray-700 hover:text-primary rounded-full transition-colors"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <Loader />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center mb-8">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">
            Try searching for another language like "english" or "spanish"
          </p>
        </div>
      )}

      {!isLoading && countries.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
              ✓ Found {countries.length} countries for {language}
            </span>
            {countries.length > itemsPerPage && (
              <div className="flex items-center gap-3 text-sm md:flex-row flex-col">
                <span className="text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-white border border-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCountries.map((country, index) => (
              <CountryCard country={country} key={index} />
            ))}
          </div>

          {countries.length > itemsPerPage && (
            <div className="flex justify-center mt-10">
              <div className="inline-flex" role="group">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="m-2 px-2 py-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="inline mr-1" />
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
                      className={`py-3 px-4 text-sm font-medium rounded-full mx-3${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : " text-blue hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="m-2 px-2 py-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="inline ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && countries.length === 0 && !language && (
        <div className="bg-blue-50 dark:bg-dark border border-blue-100 rounded-xl p-10 text-center">
          <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-white">
            Ready to explore countries by language?
          </h3>
          <p className="text-gray-600 mb-4 dark:text-white/70">
            Enter a language in the search box above to discover countries where
            it's spoken.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {popularLanguages.map((lang, index) => (
              <button
                key={index}
                onClick={() => {
                  setLanguage(lang);
                  handleSearch(lang);
                }}
                className="px-4 py-2 bg-white border border-blue-200 text-primary rounded-lg hover:bg-blue-100 transition-colors"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
