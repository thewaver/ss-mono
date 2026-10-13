import type { BaseFanMenuProps } from "@thewaver/ss-components";

import type { MenuProps, MenuSlots } from "../Menu/Menu.types";

export type FanMenuProps<T> = Omit<MenuProps<T>, "computeLayout" | "submenuMode" | "submenuOpensOn"> & BaseFanMenuProps;

export type FanMenuSlots<T> = MenuSlots<T>;
