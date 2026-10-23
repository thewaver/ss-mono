import type { BaseFanMenuValues } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";
import type { MenuProps } from "../Menu/MenuSolid.types";

export type FanMenuProps<T> = Omit<
    MenuProps<T>,
    "computeLayout" | "submenuMode" | "submenuOpensOn" | "renderGroupHeader" | "renderGroupBox"
> &
    AccessorValues<BaseFanMenuValues>;
