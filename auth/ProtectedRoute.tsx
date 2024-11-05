// src/ProtectedRoute.tsx
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, Navigate } from "react-router-dom";
import { auth } from "../src/api/firebaseConfig";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user] = useAuthState(auth);

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
