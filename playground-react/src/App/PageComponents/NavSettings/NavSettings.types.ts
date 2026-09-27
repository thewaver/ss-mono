import type { PageViewKey } from "../ViewTabs/ViewTabs.types";

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};

export type PageNavSettingsProps = {
    showsDescriptionOnlyState: readonly [boolean, (value: boolean) => void];
    pageViewState: readonly [PageViewKey, (value: PageViewKey) => void];
    viewportAnchorState: readonly [ViewportAnchor, (value: ViewportAnchor) => void];
};

export type PageNavSettingsChoiceProps<T> = {
    ariaLabel: string;
    options: NavSettingsOption<T>[];
    valueState: readonly [T, (value: T) => void];
};
