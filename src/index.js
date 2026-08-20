import React from "react";
import ReactDOM from "react-dom/client";
import GardenPlannerApp from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <FavoritesProvider>
      <GardenPlannerApp />
    </FavoritesProvider>
  </AuthProvider>
);
