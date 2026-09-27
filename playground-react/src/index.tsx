import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { defaultTheme } from "@thewaver/ss-playground-core/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(defaultTheme);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
