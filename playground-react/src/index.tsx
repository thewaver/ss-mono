import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.react);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
