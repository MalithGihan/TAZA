import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../../auth/slice/authSlice";
import { useNavigate } from "react-router-dom";

export const useAllCountries = () =>
  useQuery({
    queryKey: ["allCountries"],
    queryFn: async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      if (!res.ok) throw new Error("Failed to fetch all countries");
      return res.json();
    },
  });

export const useAllCountriesNamesAndFlags = () =>
  useQuery({
    queryKey: ["countriesNamesFlags"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags"
      );
      if (!res.ok) throw new Error("Failed to fetch names and flags");
      return res.json();
    },
  });

export const useIndependentCountries = () =>
  useQuery({
    queryKey: ["independentCountries"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/independent?status=true"
      );
      if (!res.ok) throw new Error("Failed to fetch independent countries");
      return res.json();
    },
  });

export const useCountryByName = (name) =>
  useQuery({
    queryKey: ["countryByName", name],
    queryFn: async () => {
      const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
      if (!res.ok) throw new Error("Country not found");
      return res.json();
    },
    enabled: !!name,
  });

export const useDetailedCountries = () =>
  useQuery({
    queryKey: ["detailedCountries"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,languages,currencies,area,subregion,borders,cca3"
      );
      if (!res.ok) throw new Error("Failed to fetch detailed countries");
      return res.json();
    },
  });

export const useCountryByNameFullText = (country) =>
  useQuery({
    queryKey: ["countryByNameFullText", country],
    queryFn: async () => {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          country
        )}?fullText=true`
      );
      if (!res.ok) throw new Error("Full text country search failed");
      return res.json();
    },
    enabled: !!country,
  });

export const useCountriesLatLng = () =>
  useQuery({
    queryKey: ["countriesLatLng"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,latlng,flags,cca3"
      );
      if (!res.ok) throw new Error("Failed to fetch countries with lat/lng");
      return res.json();
    },
  });

export const useCountriesByLanguage = (searchTerm) => {
  return useQuery({
    queryKey: ["countriesByLanguage", searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `https://restcountries.com/v3.1/lang/${searchTerm.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Language not found or API error");
      return res.json();
    },
    enabled: !!searchTerm.trim(), // Only fetch when searchTerm is provided
    retry: 1,
    onError: () => {
      // Handle error
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch(`http://localhost:3000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      return res.json(); // { user, token }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ name, email, phone, password }) => {
      const res = await fetch(`http://localhost:3000/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return res.json(); // { user, token }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return handleLogout;
};
