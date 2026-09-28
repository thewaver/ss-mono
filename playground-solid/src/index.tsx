import { render } from "solid-js/web";

import { solidTheme } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(solidTheme);

render(() => <App />, document.getElementById("root")!);
