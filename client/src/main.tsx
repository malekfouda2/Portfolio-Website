import { createRoot } from "react-dom/client";
import "@fontsource-variable/anybody/wdth.css";
import "@fontsource-variable/hanken-grotesk";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";

declare global {
  interface Window {
    __INITIAL_QUERY_DATA__?: Record<string, unknown>;
    __appMounted?: boolean;
  }
}

for (const [queryKey, data] of Object.entries(window.__INITIAL_QUERY_DATA__ || {})) {
  queryClient.setQueryData([queryKey], data);
}

delete window.__INITIAL_QUERY_DATA__;

createRoot(document.getElementById("root")!).render(<App />);
// Tells the fallback timer in index.html that the app took over from the prerendered HTML.
window.__appMounted = true;
