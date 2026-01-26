import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log("Mounting App...");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  console.error("Failed to mount app:", e);
  document.body.innerHTML = `<h1>Fatal Error</h1><pre>${e}</pre>`;
}
