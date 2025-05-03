import React from "react";
import { useState } from "react";
import { useLogin } from "../app/queries/useAllCountries";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="fixed top-40 inset-0 z-50 flex items-start justify-center">
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className=" w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          {loginMutation.isError && (
            <p className="text-red-500 p-1 mb-4 text-center bg-red-200 rounded-md">
              {loginMutation.error.message}
            </p>
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-primary dark:bg-dark text-white py-2 rounded hover:bg-primary/70 transition"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <button
          className="mt-4 text-primary dark:text-white hover:underline"
          onClick={() => navigate("/register")}
        >
          Don't have an account ?
        </button>
      </div>
    </div>
  );
};
