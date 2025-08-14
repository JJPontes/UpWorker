import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import CalledsListPage from "./pages/CalledsList/CalledsList";
import CreateCalledPage from "./pages/CreateCalled/CreateCalled";

import Header from "./components/Header/Header";

type AppRouterProps = {
  mode: "light" | "dark";
  onToggleTheme: () => void;
};

export default function AppRouter({ mode, onToggleTheme }: AppRouterProps) {
  const isAuth = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Header mode={mode} onToggleTheme={onToggleTheme} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/calleds"
          element={isAuth ? <CalledsListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/calleds/novo"
          element={isAuth ? <CreateCalledPage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/calleds" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
