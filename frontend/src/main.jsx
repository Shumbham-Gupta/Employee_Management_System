

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          backgroundColor: "#ffffff",
          color: "#1e1e2f",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
        progressStyle={{
          backgroundColor: "#6366f1", // Indigo accent
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
