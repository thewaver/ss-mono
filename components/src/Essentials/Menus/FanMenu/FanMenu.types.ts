import type { FanDefs } from "../../../Samples/Placement/Layouts/PlacementLayouts.types";
import type { MenuProps } from "../Menu/Menu.types";

export type FanMenuProps<T> = Omit<MenuProps<T>, "computeLayout" | "submenuMode" | "submenuOpensOn"> & {
    layoutDefs?: FanDefs;
};
