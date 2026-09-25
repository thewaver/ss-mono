import type { SignalPair } from "@thewaver/ss-components";

import type { PageViewKey } from "../ViewTabs/ViewTabs.types";

export type ViewportAnchor = "none" | "auto" | 1080 | 1440;

export type NavSettingsOption<T> = {
    value: T;
    label: string;
};

export type PageNavSettingsProps = {
    showsDescriptionOnlySignal: SignalPair<boolean>;
    pageViewSignal: SignalPair<PageViewKey>;
    viewportAnchorSignal: SignalPair<ViewportAnchor>;
};

export type PageNavSettingsChoiceProps<T> = {
    ariaLabel: string;
    options: NavSettingsOption<T>[];
    valueSignal: SignalPair<T>;
};
