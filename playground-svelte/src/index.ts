import { mount } from "svelte";

import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import App from "./App/App.svelte";

document.documentElement.classList.add(PLAYGROUND_THEMES[NavSettingsUtils.loadTheme()]);
document.documentElement.classList.add(PLAYGROUND_SKINS[NavSettingsUtils.loadSkin()]);

queueMicrotask(() => mount(App, { target: document.getElementById("root")! }));
