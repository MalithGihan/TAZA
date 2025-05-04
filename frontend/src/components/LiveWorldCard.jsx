import {
  Clock,
  DollarSign,
  Globe,
  MapPin,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import React from "react";

export const LiveWorldCard = ({
  countryDetails,
  setSelectedCountry,
  setCountryDetails,
}) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  const getCurrencies = (currencyObj) => {
    if (!currencyObj) return "N/A";
    return Object.values(currencyObj)
      .map((curr) => `${curr.name} (${curr.symbol || ""})`)
      .join(", ");
  };
  const closeDetails = () => {
    setSelectedCountry(null);
    setCountryDetails(null);

    Object.values(countryMarkers).forEach((marker) => {
      marker.visible = false;
    });
  };
  return (
    <div className="flex flex-col h-full max-h-[70vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
      <div className="relative">
        <div className="relative h-48">
          <img
            src={countryDetails.flags.png}
            alt={
              countryDetails.flags.alt ||
              `Flag of ${countryDetails.name.common}`
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>
        </div>

        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 text-white transition-all duration-300 shadow-lg"
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {countryDetails.name.common}
          </h2>
          <p className="text-white/70 text-sm font-medium">
            {countryDetails.name.official}
          </p>
        </div>
      </div>

      <div className="p-5 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/15">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-teal-400 mr-2" />
                <h3 className="text-xs uppercase tracking-wider text-teal-400">
                  Capital
                </h3>
              </div>
              <p className="font-medium">
                {countryDetails.capital?.[0] || "N/A"}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/15">
              <div className="flex items-center mb-2">
                <Globe size={16} className="text-purple-400 mr-2" />
                <h3 className="text-xs uppercase tracking-wider text-purple-400">
                  Region
                </h3>
              </div>
              <p className="font-medium">{countryDetails.region}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/15">
              <div className="flex items-center mb-2">
                <Users size={16} className="text-blue-400 mr-2" />
                <h3 className="text-xs uppercase tracking-wider text-blue-400">
                  Population
                </h3>
              </div>
              <p className="font-medium">
                {formatNumber(countryDetails.population)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all hover:bg-white/15">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-amber-400 mr-2" />
                <h3 className="text-xs uppercase tracking-wider text-amber-400">
                  Area
                </h3>
              </div>
              <p className="font-medium">
                {countryDetails.area
                  ? `${formatNumber(countryDetails.area)} km²`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:bg-white/15">
            <div className="flex items-center mb-3">
              <MessageSquare size={18} className="text-indigo-400 mr-2" />
              <h3 className="text-sm font-medium text-indigo-400">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {countryDetails.languages ? (
                Object.values(countryDetails.languages).map(
                  (language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  )
                )
              ) : (
                <span className="text-white/60">No official languages</span>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:bg-white/15">
            <div className="flex items-center mb-3">
              <DollarSign size={18} className="text-green-400 mr-2" />
              <h3 className="text-sm font-medium text-green-400">Currencies</h3>
            </div>
            <p className="text-white/90">
              {getCurrencies(countryDetails.currencies)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 transition-all hover:bg-white/15">
            <div className="flex items-center mb-3">
              <Clock size={18} className="text-orange-400 mr-2" />
              <h3 className="text-sm font-medium text-orange-400">Timezones</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {countryDetails.timezones ? (
                countryDetails.timezones.map((timezone, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full font-medium"
                  >
                    {timezone}
                  </span>
                ))
              ) : (
                <span className="text-white/60">No timezone data</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
