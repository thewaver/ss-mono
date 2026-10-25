import type { AnchorPlacement } from "@thewaver/ss-components";

import type { Action } from "./MenuActions.types";

export type MenuExampleProps = {
    onActivate: (action: Action) => void;
};

export type BaseMenuBasicDocsExampleValues = {
    isDisabled: boolean;
};

export type BaseMenuGlideDocsExampleValues = {
    isGliding: boolean;
};

export type BaseMenuDisabledItemsDocsExampleValues = {
    isReachable: boolean;
};

export type BaseMenuPlacementDocsExampleValues = {
    placement: AnchorPlacement;
    submenuPlacement: AnchorPlacement;
};

export type BaseMenuTooltipDocsExampleValues = {
    isReachableWhenDisabled: boolean;
    isDisabled: boolean;
};
