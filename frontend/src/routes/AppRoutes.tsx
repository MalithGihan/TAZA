import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import NotFound from "../pages/NotFound";
import { SearchPage } from "../pages/SearchPage";
import { HomePage } from "../pages/common/HomePage";
import CountriesByLanguage from "../components/country/CountriesByLanguage";
import AboutUs from "../pages/AboutUs";
import PopularDestinations from "../components/features/PopularDestinations";
import { LiveWorld } from "../pages/LiveWorld";
import ProtectedRoute from "../auth/ProtectedRoute";
import { Login } from "../auth/Login";
import Register from "../auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/country/language" element={<CountriesByLanguage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features/popular" element={<PopularDestinations />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/live" element={<LiveWorld />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
