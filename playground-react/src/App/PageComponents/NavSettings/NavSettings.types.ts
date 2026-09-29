import type { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

import type { PageViewKey } from "../ViewTabs/ViewTabs.types";

export type PlaygroundTheme = keyof typeof PLAYGROUND_THEMES;

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};

export type PageNavSettingsProps = {
    showsDescriptionOnly: readonly [boolean, (value: boolean) => void];
    pageView: readonly [PageViewKey, (value: PageViewKey) => void];
    viewportAnchor: readonly [ViewportAnchor, (value: ViewportAnchor) => void];
};

export type PageNavSettingsChoiceProps<T> = {
    ariaLabel: string;
    options: NavSettingsOption<T>[];
    value: readonly [T, (value: T) => void];
};
