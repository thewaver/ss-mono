import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.react);
document.documentElement.classList.add(PLAYGROUND_LOOKS[DEFAULT_LOOK]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
