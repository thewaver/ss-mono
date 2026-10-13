import type { AccessorProps, MenuItem } from "@thewaver/ss-components-solid";
import type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type { FanAction } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.types";

export type FanMenuExampleProps = AccessorProps<{
    caption: string;
}> & {
    items: MenuItem<FanAction>[];
    onActivate: (action: FanAction) => void;
};
