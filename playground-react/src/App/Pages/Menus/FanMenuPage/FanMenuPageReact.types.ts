import type { MenuItem } from "@thewaver/ss-components-react";
import type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type FanMenuExampleProps = {
    caption: string;
    items: MenuItem<FanAction>[];
    onActivate: (action: FanAction) => void;
};
