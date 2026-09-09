import { createMemo } from "solid-js";

import { createFan } from "../../../Samples/Placement/Layouts/PlacementLayouts.const";
import { Menu } from "../Menu/Menu";
import type { FanMenuProps } from "./FanMenu.types";

export const FanMenu = <T,>(props: FanMenuProps<T>) => {
    const getComputeLayout = createMemo(() => createFan(props.layoutDefs));

    return (
        <Menu<T>
            {...props}
            submenuMode={"replace"}
            submenuOpensOn={"press"}
            computeLayout={(defs) => getComputeLayout()(defs)}
        />
    );
};
