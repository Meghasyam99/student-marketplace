import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./styles/app.css";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { MarketplaceProvider } from "./context/MarketplaceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <MarketplaceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MarketplaceProvider>
    </ThemeProvider>
  </StrictMode>
);
