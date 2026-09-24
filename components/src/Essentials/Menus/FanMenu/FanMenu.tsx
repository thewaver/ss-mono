import { createMemo } from "solid-js";

import { PlacementLayoutUtils } from "../../../Generators/PlacementLayouts/PlacementLayouts.utils";
import { access } from "../../../Utils/propUtils";
import { Menu } from "../Menu/Menu";
import type { FanMenuProps } from "./FanMenu.types";

const FAN_FACING_DEGREES = 0;
const FAN_SPREAD_DEGREES = 60;
const FAN_TILT_RATIO = 0.75;

export const FanMenu = <T,>(props: FanMenuProps<T>) => {
    const getComputeLayout = createMemo(() =>
        PlacementLayoutUtils.createArc({
            facingDegrees: FAN_FACING_DEGREES,
            spreadDegrees: FAN_SPREAD_DEGREES,
            tiltRatio: FAN_TILT_RATIO,
            ...access(props.layoutDefs),
        }),
    );

    return (
        <Menu<T>
            {...props}
            submenuMode={"replace"}
            submenuOpensOn={"press"}
            computeLayout={(defs) => getComputeLayout()(defs)}
        />
    );
};
