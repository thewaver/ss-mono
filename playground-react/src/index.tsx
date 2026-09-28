import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { reactTheme } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(reactTheme);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
