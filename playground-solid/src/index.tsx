import { render } from "solid-js/web";

import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(PLAYGROUND_THEMES.solid);

render(() => <App />, document.getElementById("root")!);
