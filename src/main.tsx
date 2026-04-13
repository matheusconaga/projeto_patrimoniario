import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "../src/router/AppRoutes";
import GlobalStyle from "./constants/GlobalStyle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <AppRoutes />
  </StrictMode>
);

