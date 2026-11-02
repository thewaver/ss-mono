import type { PLAYGROUND_LOOKS } from "../../Looks/Look.const";

import type { PLAYGROUND_THEMES } from "../../Theme.css";

export type PlaygroundTheme = keyof typeof PLAYGROUND_THEMES;

export type PlaygroundLook = keyof typeof PLAYGROUND_LOOKS;

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};
