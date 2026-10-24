import type { ViewportAnchor } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import type { PageViewKey } from "../ViewTabs/ViewTabsVue.types";

export type {
    PlaygroundTheme,
    ViewportAnchor,
    NavSettingsOption,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type PageNavSettingsProps = {
    "showsDescriptionOnly": boolean;
    "onUpdate:showsDescriptionOnly"?: (value: boolean) => void;
    "pageView": PageViewKey;
    "onUpdate:pageView"?: (value: PageViewKey) => void;
    "viewportAnchor": ViewportAnchor;
    "onUpdate:viewportAnchor"?: (value: ViewportAnchor) => void;
};
