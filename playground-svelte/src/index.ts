import { mount } from "svelte";

import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import App from "./App/App.svelte";

document.documentElement.classList.add(PLAYGROUND_THEMES.svelte);
document.documentElement.classList.add(PLAYGROUND_LOOKS[DEFAULT_LOOK]);

queueMicrotask(() => mount(App, { target: document.getElementById("root")! }));
