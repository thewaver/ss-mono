import type { PLAYGROUND_THEMES } from "../../Theme.css";

export type PlaygroundTheme = keyof typeof PLAYGROUND_THEMES;

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};
