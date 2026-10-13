import type {
    NavSettingsOption,
    ViewportAnchor,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import type { PageViewKey } from "../ViewTabs/ViewTabsReact.types";

export type {
    PlaygroundTheme,
    ViewportAnchor,
    NavSettingsOption,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

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
