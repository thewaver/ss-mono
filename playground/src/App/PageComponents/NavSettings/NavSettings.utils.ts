import { DEFAULT_SKIN } from "../../Skins/Skin.const";
import {
    DEFAULT_THEME,
    DEFAULT_VIEWPORT_ANCHOR,
    NAV_SETTINGS_STORAGE_PREFIX,
    SHOWS_DESCRIPTION_ONLY_OPTIONS,
    SKIN_OPTIONS,
    THEME_OPTIONS,
    VIEWPORT_ANCHOR_OPTIONS,
} from "./NavSettings.const";
import type { NavSettingKey } from "./NavSettings.types";

const computeStorageKey = (key: NavSettingKey) => `${NAV_SETTINGS_STORAGE_PREFIX}${key}`;

const read = <T>(key: NavSettingKey, options: T[]) => {
    try {
        const stored = localStorage.getItem(computeStorageKey(key));

        if (stored === null) return undefined;

        const value = JSON.parse(stored) as T;

        return options.includes(value) ? value : undefined;
    } catch {
        return undefined;
    }
};

export namespace NavSettingsUtils {
    export const save = <T>(key: NavSettingKey, value: T) => {
        try {
            localStorage.setItem(computeStorageKey(key), JSON.stringify(value));
        } catch {
            return;
        }
    };

    export const loadTheme = () =>
        read(
            "theme",
            THEME_OPTIONS.map((option) => option.value),
        ) ?? DEFAULT_THEME;

    export const loadSkin = () =>
        read(
            "skin",
            SKIN_OPTIONS.map((option) => option.value),
        ) ?? DEFAULT_SKIN;

    export const loadViewportAnchor = () =>
        read(
            "viewportAnchor",
            VIEWPORT_ANCHOR_OPTIONS.map((option) => option.value),
        ) ?? DEFAULT_VIEWPORT_ANCHOR;

    export const loadShowsDescriptionOnly = () => read("showsDescriptionOnly", SHOWS_DESCRIPTION_ONLY_OPTIONS) ?? false;
}
