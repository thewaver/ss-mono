import { useSyncExternalStore } from "react";

import { type ShapeRevealOpts, ShapeRevealUtils } from "@thewaver/ss-components-react";
import type { PlaygroundTheme } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";
import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";

let appliedTheme: PlaygroundTheme = OWN_FRAMEWORK;

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
    listeners.forEach((listener) => listener());

    return ShapeRevealUtils.reveal(() => applyTheme(theme), opts);
};
