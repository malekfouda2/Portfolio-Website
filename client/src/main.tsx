import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";

declare global {
  interface Window {
    __INITIAL_QUERY_DATA__?: Record<string, unknown>;
  }
}

for (const [queryKey, data] of Object.entries(window.__INITIAL_QUERY_DATA__ || {})) {
  queryClient.setQueryData([queryKey], data);
}

delete window.__INITIAL_QUERY_DATA__;

createRoot(document.getElementById("root")!).render(<App />);
