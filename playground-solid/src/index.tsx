import { render } from "solid-js/web";

import { defaultTheme } from "@thewaver/ss-playground-core/App/Theme.css";

import { App } from "./App/App";

document.documentElement.classList.add(defaultTheme);

render(() => <App />, document.getElementById("root")!);
