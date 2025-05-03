import { render, screen } from "@testing-library/react";
import CountriesByLanguage from "../../components/country/CountriesByLanguage";
import { useCountriesByLanguage } from "../../app/queries/useAllCountries";

// Mock the query hook
jest.mock("../../app/queries/useAllCountries");

test("displays error message on error", () => {
  useCountriesByLanguage.mockReturnValue({
    data: [],
    isLoading: false,
    error: "Something went wrong",
  });

  render(<CountriesByLanguage />);
  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
});
