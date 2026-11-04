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
    // GROOMED
    { value: "plasticine", label: "Plasticine" },
    // OTHER
    { value: "material", label: "Material" },
    { value: "retroOS", label: "Retro OS" },
    { value: "terminal", label: "Terminal" },
    { value: "_acrylic", label: "_Acrylic" },
    { value: "_beveled", label: "_Beveled" },
    { value: "_clear", label: "_Clear" },
    { value: "_gemstone", label: "_Gemstone" },
    { value: "_glossy", label: "_Glossy" },
    { value: "_hardCandy", label: "_Hard Candy" },
    { value: "_hollow", label: "_Hollow" },
    { value: "_matte", label: "_Matte" },
    { value: "_minimal", label: "_Minimal" },
    { value: "_neon", label: "_Neon" },
    { value: "_plastic", label: "_Plastic" },
    { value: "_retro", label: "_Retro" },
    { value: "_shaded", label: "_Shaded" },
    { value: "_softCandy", label: "_Soft Candy" },
];

export const NO_MOTION_DURATION_MS = 0;
