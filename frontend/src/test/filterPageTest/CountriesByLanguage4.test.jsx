import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import CountriesByLanguage from "../../components/country/CountriesByLanguage";
import { useCountriesByLanguage } from "../../app/queries/useAllCountries";

// Mock the query hook
jest.mock("../../app/queries/useAllCountries");

test("updates search term and shows results", async () => {
  useCountriesByLanguage.mockReturnValue({
    data: [{ name: "Spain" }, { name: "Mexico" }],
    isLoading: false,
    error: null,
  });

  render(<CountriesByLanguage />);

  const input = screen.getByPlaceholderText(/Type a language/i);
  await userEvent.type(input, "Spanish{enter}");

  expect(
    screen.getByText(/✓ Found 2 countries for Spanish/i)
  ).toBeInTheDocument();
});
