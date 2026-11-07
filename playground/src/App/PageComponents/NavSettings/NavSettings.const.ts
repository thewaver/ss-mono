import type { NavSettingsOption, PlaygroundSkin, PlaygroundTheme, ViewportAnchor } from "./NavSettings.types";

export const DEFAULT_VIEWPORT_ANCHOR: ViewportAnchor = "auto";

export const THEME_FIELD_ID = "playgroundTheme";

export const SKIN_FIELD_ID = "playgroundSkin";

export const VIEWPORT_ANCHOR_OPTIONS: NavSettingsOption<ViewportAnchor>[] = [
    { value: "none", label: "None" },
    { value: "auto", label: "Auto" },
    { value: 1080, label: "1080p" },
    { value: 1440, label: "1440p" },
];

export const THEME_OPTIONS: NavSettingsOption<PlaygroundTheme>[] = [
    { value: "default", label: "Default" },
    { value: "solid", label: "Solid" },
    { value: "react", label: "React" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
];

export const SKIN_OPTIONS: NavSettingsOption<PlaygroundSkin>[] = [
    { value: "acrylic", label: "Acrylic" },
    { value: "blocky", label: "Blocky" },
    { value: "cardboard", label: "Cardboard" },
    { value: "cartoon", label: "Cartoon" },
    { value: "plasticine", label: "Plasticine" },
    { value: "terminal", label: "Terminal" },
];

export const NO_MOTION_DURATION_MS = 0;
