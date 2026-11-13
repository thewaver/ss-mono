import { useSyncExternalStore } from "react";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-react";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { NavSettingsUtils } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.utils";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

let appliedTheme: PlaygroundTheme = NavSettingsUtils.loadTheme();

const listeners = new Set<() => void>();

const applyTheme = (theme: PlaygroundTheme) => {
    document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
    document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const getAppliedTheme = () => appliedTheme;

export const useAppliedTheme = () => useSyncExternalStore(subscribe, getAppliedTheme);

export const revealTheme = (theme: PlaygroundTheme, opts: ShapeRevealOpts) => {
    appliedTheme = theme;
    NavSettingsUtils.save("theme", theme);
    listeners.forEach((listener) => listener());

    return ShapeRevealUtils.reveal(() => applyTheme(theme), opts);
};
