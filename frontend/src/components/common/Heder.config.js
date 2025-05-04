export const navLinks = [
  {
    name: "Home",
    path: "/",
    hasDropdown: false,
  },
  {
    name: "Countries",
    path: "/countries",
    hasDropdown: true,
    dropdownContent: [
      { name: "By Language", path: "/country/language" },
      { name: "By Currency", path: "/country/currency" },
      { name: "By Religion", path: "/country/religion" },
      { name: "By Capital City", path: "/country/capital" },
      { name: "By Translation", path: "/country/translation" },
      { name: "By Subregions", path: "/country/subregions" },
    ],
  },
  {
    name: "Features",
    path: "/features",
    hasDropdown: true,
    dropdownContent: [
      { name: "Popular Destinations", path: "/features/popular" },
      { name: "Flags", path: "/restaurants/popular" },
      { name: "Region ", path: "/restaurants/new" },
      { name: "Language", path: "/allRestaurants" },
    ],
  },
  {
    name: "About Us",
    path: "/about",
    hasDropdown: false,
  },
];
