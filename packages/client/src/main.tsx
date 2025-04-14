import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Providers } from "./providers";

import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { env } from "./utils/env";
import { initializeWidget } from "./lib/widget-starter";

if (env.WIDGET_ENTRY) {
  initializeWidget();
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  );
}
