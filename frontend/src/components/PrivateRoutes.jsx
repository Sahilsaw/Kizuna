import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export function ProtectedRoutes({ children }) {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if(isCheckingAuth)
      checkAuth();
  }, [checkAuth]); 

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return user ? children : <Navigate to="/login" />;
}

export function AuthenticatedRoutes({ children }) {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if(isCheckingAuth)
      checkAuth();
  }, [checkAuth]); 

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return !user ? children : <Navigate to="/" />;
}



