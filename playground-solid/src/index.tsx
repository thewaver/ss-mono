import { render } from "solid-js/web";

import { DEFAULT_SKIN, PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.solid);
document.documentElement.classList.add(PLAYGROUND_SKINS[DEFAULT_SKIN]);

render(() => <App />, document.getElementById("root")!);
