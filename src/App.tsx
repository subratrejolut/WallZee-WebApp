// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginForm from "./components/Login";
import WallpaperForm from "./components/WallpaperForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Route */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <WallpaperForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
