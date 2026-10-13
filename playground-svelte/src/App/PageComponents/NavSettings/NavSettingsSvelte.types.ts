import type {
    NavSettingsOption,
    ViewportAnchor,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import type { PageViewKey } from "../ViewTabs/ViewTabsSvelte.types";

export type {
    PlaygroundTheme,
    ViewportAnchor,
    NavSettingsOption,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type PageNavSettingsProps = {
    showsDescriptionOnly: boolean;
    pageView: PageViewKey;
    viewportAnchor: ViewportAnchor;
};

export type PageNavSettingsChoiceProps<T> = {
    ariaLabel: string;
    options: NavSettingsOption<T>[];
    value: T;
};
