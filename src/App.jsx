import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/router";
import useAuthStore from "./store/authStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log("isAuthenticated:", isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
