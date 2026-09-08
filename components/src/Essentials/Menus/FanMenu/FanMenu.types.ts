import type { FanDefs } from "../../../Samples/Menu/Layouts/MenuLayouts.types";
import type { MenuProps } from "../Menu/Menu.types";

export type FanMenuProps<T> = Omit<MenuProps<T>, "computeLayout" | "submenuMode" | "submenuOpensOn"> & {
    layoutDefs?: FanDefs;
};
