import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DEFAULT_SKIN, PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.react);
document.documentElement.classList.add(PLAYGROUND_SKINS[DEFAULT_SKIN]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
