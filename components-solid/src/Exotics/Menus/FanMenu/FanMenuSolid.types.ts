import type { BaseFanMenuValues } from "@thewaver/ss-components";

import type { MenuProps } from "../../../Essentials/Menus/Menu/MenuSolid.types";
import type { AccessorValues } from "../../../Utils/typeUtils";

export type FanMenuProps<T> = Omit<
    MenuProps<T>,
    "computeLayout" | "submenuMode" | "submenuOpensOn" | "renderGroupHeader" | "renderGroupBox"
> &
    AccessorValues<BaseFanMenuValues>;
