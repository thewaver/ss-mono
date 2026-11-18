import { createMemo } from "solid-js";

import { FanMenuUtils } from "@thewaver/ss-components";

import { Menu } from "../../../Essentials/Menus/Menu/Menu";
import { access } from "../../../Utils/propUtils";
import type { FanMenuProps } from "./FanMenuSolid.types";

export const FanMenu = <T,>(props: FanMenuProps<T>) => {
    const getComputeLayout = createMemo(() => FanMenuUtils.createLayout(access(props.layoutDefs)));

    return (
        <Menu<T>
            {...props}
            submenuMode={"replace"}
            submenuOpensOn={"press"}
            computeLayout={(defs) => getComputeLayout()(defs)}
        />
    );
};
