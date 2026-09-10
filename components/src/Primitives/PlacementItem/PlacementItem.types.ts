import type { ParentProps } from "solid-js";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type PlacementItemProps = ParentProps<
    AccessorProps<{
        placement: PlacementRect;
        stackAt?: number;
    }>
>;
