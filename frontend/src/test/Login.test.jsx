import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../app/queries/useAllCountries";
import { Login } from "../auth/Login";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("../app/queries/useAllCountries");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Page", () => {
  const mockMutate = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: { message: "Invalid credentials" },
    });
  });

  test("renders inputs and login button", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("submits form with email and password", () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret123",
    });
  });

  test("shows error message if login fails", () => {
    useLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: { message: "Login failed" },
    });

    render(<Login />);
    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
  });

  test("navigates to register page", () => {
    render(<Login />);
    fireEvent.click(screen.getByText(/don't have an account/i));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
