import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/Theme";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/* REDUX */
import { Provider } from "react-redux";
import { store } from "./store/store";

/* TOAST */
import { Toaster } from "sonner";

import "./assets/css/index.css";

/* =====================================================
   REACT QUERY CLIENT
===================================================== */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/* =====================================================
   APP ROOT
===================================================== */

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              richColors
              expand
              closeButton
            />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
//connects react to the root div in index.html.