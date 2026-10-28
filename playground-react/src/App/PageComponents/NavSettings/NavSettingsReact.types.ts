import type { ViewportAnchor } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type {
    PlaygroundTheme,
    ViewportAnchor,
    NavSettingsOption,
} from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.types";

export type PageNavSettingsProps = {
    showsDescriptionOnly: readonly [boolean, (value: boolean) => void];
    viewportAnchor: readonly [ViewportAnchor, (value: ViewportAnchor) => void];
};
