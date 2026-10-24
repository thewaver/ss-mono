import type { SignalPair } from "@thewaver/ss-components-solid";
import type { ViewportAnchor } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

import type { PageViewKey } from "../ViewTabs/ViewTabsSolid.types";

export type {
    PlaygroundTheme,
    ViewportAnchor,
    NavSettingsOption,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type PageNavSettingsProps = {
    showsDescriptionOnly: SignalPair<boolean>;
    pageView: SignalPair<PageViewKey>;
    viewportAnchor: SignalPair<ViewportAnchor>;
};
