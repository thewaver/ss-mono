import { render } from "solid-js/web";

import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_SKINS } from "@thewaver/ss-playground/App/Skins/Skin.const";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { App } from "./App/App";
import { OWN_FRAMEWORK } from "./App/PageComponents/FrameworkMenu/FrameworkMenu.const";

document.documentElement.classList.add(PLAYGROUND_THEMES[NavSettingsUtils.loadTheme(OWN_FRAMEWORK)]);
document.documentElement.classList.add(PLAYGROUND_SKINS[NavSettingsUtils.loadSkin()]);

render(() => <App />, document.getElementById("root")!);
