import { useMemo } from "react";

import { FanMenuUtils } from "@thewaver/ss-components";

import { Menu } from "../Menu/Menu";
import type { FanMenuProps } from "./FanMenu.types";

export const FanMenu = <T,>(props: FanMenuProps<T>) => {
    const layoutDefs = props.layoutDefs;

    const computeLayout = useMemo(() => FanMenuUtils.createLayout(layoutDefs), [layoutDefs]);

    return <Menu<T> {...props} submenuMode={"replace"} submenuOpensOn={"press"} computeLayout={computeLayout} />;
};
