import React from "react";
import { render, screen } from "@testing-library/react";
import { CountryCard } from "../components/CountryCard"; // update this path if needed

const mockCountry = {
  cca3: "USA",
  flags: {
    png: "https://flagcdn.com/us.png",
    alt: "USA Flag",
  },
  name: {
    common: "United States",
  },
  capital: ["Washington, D.C."],
  population: 331000000,
  area: 9833520,
  region: "Americas",
  subregion: "Northern America",
  languages: {
    eng: "English",
  },
  currencies: {
    USD: { name: "United States dollar", symbol: "$" },
  },
};

describe("CountryCard Component", () => {
  it("renders country name, capital, population, area, region, and currency", () => {
    render(<CountryCard country={mockCountry} index={0} />);

    // Basic content
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Washington, D.C.")).toBeInTheDocument();

    // Formatted numbers
    expect(screen.getByText("331,000,000")).toBeInTheDocument();
    expect(screen.getByText("9,833,520")).toBeInTheDocument();

    // Region & subregion
    expect(
      screen.getAllByText((_, element) =>
        element.textContent?.includes("(Northern America)")
      ).length
    ).toBeGreaterThan(0);

    // Language
    expect(screen.getByText("English")).toBeInTheDocument();

    // Currency
    const matches = screen.getAllByText((_, element) =>
      element.textContent?.includes("(Northern America)")
    );
    expect(matches.length).toBeGreaterThan(0);

    // Image alt
    expect(screen.getByAltText("USA Flag")).toBeInTheDocument();
  });

  it("handles missing optional fields gracefully", () => {
    const minimalCountry = {
      cca3: "XYZ",
      flags: {
        png: "/xyz.png",
      },
      name: {
        common: "Testland",
      },
      population: 123456,
      region: "Test Region",
    };

    render(<CountryCard country={minimalCountry} index={0} />);

    expect(screen.getByText("Testland")).toBeInTheDocument();
    expect(screen.getByText("123,456")).toBeInTheDocument();
    expect(screen.getAllByText("Test Region").length).toBeGreaterThan(0);

    // Fields not passed should show fallback
    expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(1);
  });
});
