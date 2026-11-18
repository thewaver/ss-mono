import type { BaseFanMenuProps } from "@thewaver/ss-components";

import type { MenuProps } from "../../../Essentials/Menus/Menu/Menu.types";

export type FanMenuProps<T> = Omit<
    MenuProps<T>,
    "computeLayout" | "submenuMode" | "submenuOpensOn" | "renderGroupHeader" | "renderGroupBox"
> &
    BaseFanMenuProps;
