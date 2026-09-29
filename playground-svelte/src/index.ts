import { mount } from "svelte";

import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import App from "./App/App.svelte";

document.documentElement.classList.add(PLAYGROUND_THEMES.svelte);

queueMicrotask(() => mount(App, { target: document.getElementById("root")! }));
