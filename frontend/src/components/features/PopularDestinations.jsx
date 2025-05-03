import React from "react";
import { CountryCard } from "../CountryCard";
import { useCountryByNameFullText } from "../../app/queries/useAllCountries";

export default function PopularDestinations() {
  const popularCountries = [
    "France",
    "Spain",
    "Mexico",
    "Thailand",
    "Saudi Arabia",
    "United States",
    "United Kingdom",
    "Italy",
    "Germany",
    "Japan",
    "Australia",
    "Brazil",
  ];

  const countriesData = popularCountries.map((country) => {
    return useCountryByNameFullText(country);
  });

  const fetchedCountries = countriesData.map(({ data, isLoading, error }) => {
    if (isLoading) return { loading: true };
    if (error) return { error: error.message };
    return { country: data ? data[0] : null };
  });

  const successfulCountries = fetchedCountries.filter(
    (result) => result.country
  );

  if (successfulCountries.length === 0) {
    return <p>Loading popular destinations...</p>;
  }

  return (
    <div className="font-serif min-h-screen pt-36 pb-16 justify-center items-center max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-3 ">
          Popular Travel Destinations
        </h1>
        <p className="font-inter text-gray-600 max-w-2xl mx-auto">
          Discover countries around the world where different languages are
          spoken. Enter a language below to find related countries.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {successfulCountries.map((country, index) => (
          <CountryCard country={country.country} key={index} />
        ))}
      </div>
    </div>
  );
}
