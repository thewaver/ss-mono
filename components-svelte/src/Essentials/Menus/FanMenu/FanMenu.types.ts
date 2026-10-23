import type { BaseFanMenuProps } from "@thewaver/ss-components";

import type { MenuProps } from "../Menu/Menu.types.js";

export type FanMenuProps<T> = Omit<
    MenuProps<T>,
    "computeLayout" | "submenuMode" | "submenuOpensOn" | "renderGroupHeader" | "renderGroupBox"
> &
    BaseFanMenuProps;
