import { mount } from "svelte";

import { DEFAULT_SKIN, PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import App from "./App/App.svelte";

document.documentElement.classList.add(PLAYGROUND_THEMES.svelte);
document.documentElement.classList.add(PLAYGROUND_SKINS[DEFAULT_SKIN]);

queueMicrotask(() => mount(App, { target: document.getElementById("root")! }));
