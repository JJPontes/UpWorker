import React, { useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AppRouter from "./AppRouter";

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#005baa" },
          secondary: { main: "#ffb600" },
          background:
            mode === "dark"
              ? { default: "#181c24", paper: "#232a36" }
              : { default: "#f5f7fa", paper: "#fff" },
          text:
            mode === "dark"
              ? { primary: "#fff", secondary: "#b0b8c1" }
              : { primary: "#222", secondary: "#555" },
        },
        typography: {
          fontFamily: "Montserrat, Arial, sans-serif",
        },
      }),
    [mode],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter
          mode={mode}
          onToggleTheme={() =>
            setMode((m) => (m === "light" ? "dark" : "light"))
          }
        />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}
