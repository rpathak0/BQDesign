import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>BQV2</h1>
      <p>Client is running. For the full Next.js app, run <code>npm run dev:client</code> in a separate terminal.</p>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
