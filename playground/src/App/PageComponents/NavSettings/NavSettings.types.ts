import type { PLAYGROUND_SKINS } from "../../Skins/Skin.const";

import type { PLAYGROUND_THEMES } from "../../Theme.css";

export type PlaygroundTheme = keyof typeof PLAYGROUND_THEMES;

export type PlaygroundSkin = keyof typeof PLAYGROUND_SKINS;

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingKey = "theme" | "skin" | "viewportAnchor" | "showsDescriptionOnly";

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};
