import type { NavSettingsOption, PlaygroundLook, PlaygroundTheme, ViewportAnchor } from "./NavSettings.types";

export const DEFAULT_VIEWPORT_ANCHOR: ViewportAnchor = "auto";

export const THEME_FIELD_ID = "playgroundTheme";

export const LOOK_FIELD_ID = "playgroundLook";

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

export const LOOK_OPTIONS: NavSettingsOption<PlaygroundLook>[] = [
    { value: "aqua", label: "Aqua" },
    { value: "blueprint", label: "Blueprint" },
    { value: "brutalist", label: "Brutalist" },
    { value: "clay", label: "Clay" },
    { value: "glass", label: "Glass" },
    { value: "hud", label: "HUD" },
    { value: "material", label: "Material" },
    { value: "neon", label: "Neon" },
    { value: "paper", label: "Paper" },
    { value: "pixel", label: "Pixel" },
    { value: "plasma", label: "Plasma" },
    { value: "plasticine", label: "Plasticine" },
    { value: "retro_os", label: "Retro OS" },
    { value: "terminal", label: "Terminal" },
];

export const NO_MOTION_DURATION_MS = 0;
