import { render, screen } from "@testing-library/react";
import CountriesByLanguage from "../../components/country/CountriesByLanguage";
import { useCountriesByLanguage } from "../../app/queries/useAllCountries";

// Mock the query hook
jest.mock("../../app/queries/useAllCountries");

test("renders without crashing", () => {
  useCountriesByLanguage.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  });

  render(<CountriesByLanguage />);
  expect(
    screen.getByText(/Explore Countries by Language/i)
  ).toBeInTheDocument();
});
