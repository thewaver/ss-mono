import type { ArcDefs } from "../../../Generators/PlacementLayouts/PlacementLayouts.types";
import type { AccessorProps } from "../../../Utils/typeUtils";
import type { MenuProps } from "../Menu/Menu.types";

export type FanMenuProps<T> = Omit<MenuProps<T>, "computeLayout" | "submenuMode" | "submenuOpensOn"> &
    AccessorProps<{
        /** How the items sit on their arc, for the parts of the arrangement the menu does not decide itself. */
        layoutDefs?: ArcDefs;
    }>;
