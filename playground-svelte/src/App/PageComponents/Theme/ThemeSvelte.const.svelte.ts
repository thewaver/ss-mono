import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-svelte";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";

let appliedTheme = $state<PlaygroundTheme>(OWN_FRAMEWORK);

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

export const getAppliedTheme = () => appliedTheme;

export const revealTheme = (theme: PlaygroundTheme, opts: ShapeRevealOpts) => {
    appliedTheme = theme;

    return ShapeRevealUtils.reveal(() => applyTheme(theme), opts);
};
