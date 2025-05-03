import React, { useState } from "react";
import { useRegister } from "../app/queries/useAllCountries";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { mutate: register, error } = useRegister();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="fixed top-40 inset-0 z-50 flex items-start justify-center">
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className=" w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          {error && (
            <p className="text-red-500 p-1 mb-4 text-center bg-red-200 rounded-md">
              {error.message}
            </p>
          )}
          <input
            name="name"
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="phone"
            onChange={handleChange}
            type="phone"
            placeholder="Phone"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white dark:bg-dark py-2 rounded hover:bg-primary/70 transition"
          >
            Register
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-primary hover:underline dark:text-white"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
};

export default Register;
