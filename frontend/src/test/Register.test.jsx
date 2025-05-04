import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../app/queries/useAllCountries";
import Register from "../auth/Register";

// Mock useRegister and useNavigate
jest.mock("../app/queries/useAllCountries", () => ({
  useRegister: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Register Component", () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useRegister.mockReturnValue({
      mutate: mockRegister,
      error: null,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form fields", () => {
    render(<Register />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("submits the form with entered values", () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890", name: "phone" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(mockRegister).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
      phone: "1234567890",
      password: "password123",
    });
  });

  it("navigates to login on button click", () => {
    render(<Register />);
    fireEvent.click(screen.getByText("Already have an account?"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("displays error message when error exists", () => {
    useRegister.mockReturnValue({
      mutate: mockRegister,
      error: { message: "Registration failed" },
    });

    render(<Register />);
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });
});
