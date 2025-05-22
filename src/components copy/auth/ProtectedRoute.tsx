import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isRegistered = localStorage.getItem("registered") === "true";
  const location = useLocation();
  
  if (!isRegistered) {
    // redirect to register, but remember where we came from
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
