import { PAGE_VIEW_KEYS, PAGE_VIEW_LABELS } from "../ViewTabs/ViewTabs.const";
import type { PageViewKey } from "../ViewTabs/ViewTabs.types";
import type { NavSettingsOption, ViewportAnchor } from "./NavSettings.types";

export const DEFAULT_VIEWPORT_ANCHOR: ViewportAnchor = "auto";

export const PAGE_VIEW_OPTIONS: NavSettingsOption<PageViewKey>[] = PAGE_VIEW_KEYS.map((key) => ({
    value: key,
    label: PAGE_VIEW_LABELS[key],
}));

export const VIEWPORT_ANCHOR_OPTIONS: NavSettingsOption<ViewportAnchor>[] = [
    { value: "none", label: "None" },
    { value: "auto", label: "Auto" },
    { value: 1080, label: "1080p" },
    { value: 1440, label: "1440p" },
];
