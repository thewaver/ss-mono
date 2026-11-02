import { render } from "solid-js/web";

import { DEFAULT_LOOK, PLAYGROUND_LOOKS } from "@thewaver/ss-playground/App/Looks/Look.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.solid);
document.documentElement.classList.add(PLAYGROUND_LOOKS[DEFAULT_LOOK]);

render(() => <App />, document.getElementById("root")!);
