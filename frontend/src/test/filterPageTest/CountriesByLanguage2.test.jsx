import { render, screen } from "@testing-library/react";
import CountriesByLanguage from "../../components/country/CountriesByLanguage";
import { useCountriesByLanguage } from "../../app/queries/useAllCountries";

// Mock the query hook
jest.mock("../../app/queries/useAllCountries");

test("displays loader when loading", () => {
  useCountriesByLanguage.mockReturnValue({
    data: [],
    isLoading: true,
    error: null,
  });

  render(<CountriesByLanguage />);
  expect(screen.getByTestId("loader")).toBeInTheDocument(); // add `data-testid="loader"` to your `<Loader />`
});
