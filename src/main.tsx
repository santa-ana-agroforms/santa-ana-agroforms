import '@ant-design/v5-patch-for-react-19';
import "antd/dist/reset.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
