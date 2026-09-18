import type { ArcDefs } from "../../../Samples/Placement/Layouts/PlacementLayouts.types";
import type { MenuProps } from "../Menu/Menu.types";

export type FanMenuProps<T> = Omit<MenuProps<T>, "computeLayout" | "submenuMode" | "submenuOpensOn"> & {
    /** How the items sit on their arc, for the parts of the arrangement the menu does not decide itself. */
    layoutDefs?: ArcDefs;
};
