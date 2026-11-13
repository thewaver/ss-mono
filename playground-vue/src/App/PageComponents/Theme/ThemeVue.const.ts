import { shallowRef } from "vue";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-vue";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

export const appliedTheme = shallowRef<PlaygroundTheme>(NavSettingsUtils.loadTheme());

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

export const revealTheme = (theme: PlaygroundTheme, opts: ShapeRevealOpts) => {
    appliedTheme.value = theme;
    NavSettingsUtils.save("theme", theme);

    return ShapeRevealUtils.reveal(() => applyTheme(theme), opts);
};
