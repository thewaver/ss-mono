import { createSignal } from "solid-js";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-solid";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";

const [getAppliedTheme, setAppliedTheme] = createSignal<PlaygroundTheme>(OWN_FRAMEWORK);

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

export { getAppliedTheme };

export const revealTheme = (theme: PlaygroundTheme, opts: ShapeRevealOpts) => {
    setAppliedTheme(theme);

    return ShapeRevealUtils.reveal(() => applyTheme(theme), opts);
};
