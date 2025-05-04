import React, { useState, useEffect } from "react";
import {
  Globe,
  Search,
  Filter,
  Map,
  Code,
  Users,
  MessageCircle,
} from "lucide-react";
import image from "../assets/Asset 11.png";
import Loader from "../components/reload/Loader";

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    features: false,
    api: false,
    team: false,
    contact: false,
  });

  useEffect(() => {
    setIsVisible({
      hero: true,
      mission: false,
      features: false,
      api: false,
      team: false,
      contact: false,
    });

    const timers = [
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, mission: true })),
        400
      ),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, features: true })),
        800
      ),
      setTimeout(() => setIsVisible((prev) => ({ ...prev, api: true })), 1200),
      setTimeout(() => setIsVisible((prev) => ({ ...prev, team: true })), 1600),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, contact: true })),
        2000
      ),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const features = [
    {
      title: "Country Database",
      description:
        "Access comprehensive information about every country including population, flags, languages, and more.",
      icon: <Globe size={24} />,
    },
    {
      title: "Powerful Search",
      description:
        "Find countries by name instantly with our responsive search functionality.",
      icon: <Search size={24} />,
    },
    {
      title: "Region & Language Filters",
      description:
        "Filter countries by region or language to narrow down your exploration.",
      icon: <Filter size={24} />,
    },
    {
      title: "Interactive Maps",
      description:
        "Visualize country locations with our integrated mapping system.",
      icon: <Map size={24} />,
    },
  ];

  const apiEndpoints = [
    {
      endpoint: "GET /all",
      description:
        "Retrieve complete list of all countries with key information",
      used: "Homepage country listing",
    },
    {
      endpoint: "GET /name/{name}",
      description: "Search for countries by full or partial name",
      used: "Search functionality",
    },
    {
      endpoint: "GET /region/{region}",
      description: "Filter countries by continental region",
      used: "Region filter dropdown",
    },
    {
      endpoint: "GET /alpha/{code}",
      description: "Get detailed information for a specific country",
      used: "Country detail pages",
    },
  ];

  return (
    <div className="font-serif max-w-6xl mx-auto pt-36 font-sans md:px-10 px-4">
      <section
        className={`text-center mb-20 transform transition-all duration-1000 ease-out ${
          isVisible.hero
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="relative mb-8">
          <h1 className="text-5xl font-bold mb-4 text-primary ">
            About Country Explorer
          </h1>
        </div>
        <p className="font-inter text-xl text-gray-700 max-w-2xl mx-auto dark:text-white">
          Your interactive window to explore detailed information about every
          country in the world
        </p>
      </section>

      <section
        className={`mb-20 transform transition-all duration-1000 ease-out ${
          isVisible.mission
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <div className="flex justify-center h-64 overflow-hidden relative item-center">
              <img src={image} className="h-[500px]" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-6xl font-bold mb-4 text-dark">TAZA</h2>
            <h2 className="font-inter text-xl font-semibold mb-4 text-dark">
              Our Mission
            </h2>
            <p className="font-inter text-md font-regular text-gray-700">
              At Country Explorer, we're passionate about making global
              information accessible to everyone. We've built a powerful yet
              intuitive platform that connects to the REST Countries API,
              allowing users to discover and learn about nations across the
              globe with detailed data on populations, languages, flags,
              capitals and more.
            </p>
          </div>
        </div>
      </section>

      <section
        className={`mb-20 transform transition-all duration-1000 ease-out ${
          isVisible.features
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className=" flex flex-col justify-center">
          <h2 className="text-center font-bold text-4xl mb-8">
            Special Thanks
          </h2>
          <p className="font-inter text-center font-bold text-xl mb-4">
            Open Source API Provider
          </p>
          <button
            className="py-2 px-4 rounded-lg font-bold font-inter bg-success/10 text-success"
            href="https://github.com/apilayer/restcountries/"
          >
            Check this out - https://github.com/apilayer/restcountries/{" "}
          </button>
        </div>
      </section>

      <section
        className={`mb-20 transform transition-all duration-1000 ease-out ${
          isVisible.features
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-semibold mb-8 text-left text-primary dark:text-white">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 text-teal-600 bg-teal-50 p-3 rounded-full inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`mb-20 transform transition-all duration-1000 ease-out ${
          isVisible.api
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center mb-6">
            <Code className="mr-3 text-teal-400" size={28} />
            <h2 className="text-3xl font-bold">
              REST Countries API Integration
            </h2>
          </div>
          <p className="text-lg mb-8 text-gray-300">
            Our application leverages the powerful REST Countries API to provide
            you with accurate and up-to-date information. We utilize multiple
            endpoints to create a seamless experience:
          </p>

          <div className="space-y-4">
            {apiEndpoints.map((api, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-teal-500 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-2 sm:mb-0">
                    <code className="text-teal-400 font-mono font-semibold">
                      {api.endpoint}
                    </code>
                    <p className="text-gray-400 text-sm mt-1">
                      {api.description}
                    </p>
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded text-sm text-teal-300">
                    {api.used}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`mb-10 transform transition-all duration-1000 ease-out ${
          isVisible.contact
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="flex items-center mb-4">
                <MessageCircle className="mr-2" size={24} />
                <h2 className="text-2xl font-bold">Get in Touch</h2>
              </div>
              <p className="text-lg opacity-90 mb-4">
                Have questions about our country data? Want to suggest new
                features or report an issue?
              </p>
              <a
                href="mailto:contact@countryexplorer.com"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
            <div className="w-full md:w-1/2 bg-white bg-opacity-10 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Feedback</h3>
              <p className="mb-4">
                We're constantly improving Country Explorer based on user
                feedback. Let us know how we can make your experience better!
              </p>
              <div className="flex items-center text-sm">
                <Users className="mr-2" size={18} />
                <span>
                  Join our user community:{" "}
                  <a href="#" className="underline hover:text-blue-200">
                    Discord
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
