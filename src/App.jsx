import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "./routes/router";
import useAuthStore from "./store/authStore";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Loading from "./components/common/Loading";

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {isLoading && <Loading fullScreen />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;