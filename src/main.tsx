import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import OSDUAdmin from "./ui/OSDUAdmin.tsx";
import "./indexeddb/indexedDbHandler.ts";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OSDUAdmin />
  </StrictMode>
);
