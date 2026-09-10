import { createMemo } from "solid-js";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { access } from "../../Utils/propUtils";
import type { PlacementItemProps } from "./PlacementItem.types";

import * as styles from "./PlacementItem.css";

const NO_ANGLE = 0;

const toBoxStyle = (rect: PlacementRect, stackAt: number | undefined) => ({
    "left": PlacementUtils.toContainerWidth(rect.left),
    "top": PlacementUtils.toContainerWidth(rect.top),
    "width": PlacementUtils.toContainerWidth(rect.width),
    "height": PlacementUtils.toContainerWidth(rect.height),
    "transform": `translate(-50%, -50%) rotate(${rect.angle ?? NO_ANGLE}deg)`,
    "z-index": rect.depth ?? stackAt,
    "clip-path": rect.clipPath,
});

export const PlacementItem = (props: PlacementItemProps) => {
    const getStyle = createMemo(() => toBoxStyle(access(props.placement), access(props.stackAt)));

    return (
        <div class={styles.placementItem} style={getStyle()} role="presentation">
            {props.children}
        </div>
    );
};
