import { createMemo } from "solid-js";

import { access } from "../../Utils/propUtils";
import type { PlacementBoxProps, PlacementItemProps, PlacementRect } from "./Placement.types";
import { PlacementUtils } from "./Placement.utils";

import * as styles from "./Placement.css";

const NO_ANGLE = 0;
const PARENT_WIDTH = "100%";

const toBoxStyle = (rect: PlacementRect, stackAt: number | undefined) => ({
    "left": PlacementUtils.toContainerWidth(rect.left),
    "top": PlacementUtils.toContainerWidth(rect.top),
    "width": PlacementUtils.toContainerWidth(rect.width),
    "height": PlacementUtils.toContainerWidth(rect.height),
    "transform": `translate(-50%, -50%) rotate(${rect.angle ?? NO_ANGLE}deg)`,
    "z-index": rect.depth ?? stackAt,
    "clip-path": rect.clipPath,
});

export const PlacementBox = (props: PlacementBoxProps) => {
    const getLayout = createMemo(() => access(props.layout));

    const getWidth = () => {
        const width = getLayout().width;

        return width === undefined ? PARENT_WIDTH : `${width}px`;
    };

    return (
        <div
            ref={(element) => props.ref?.(element)}
            class={styles.placementBox}
            style={{ width: getWidth() }}
            role="presentation"
        >
            <div
                class={styles.placementSpacer}
                style={{ height: PlacementUtils.toContainerWidth(getLayout().heightRatio) }}
                aria-hidden="true"
            />

            {props.children}
        </div>
    );
};

export const PlacementItem = (props: PlacementItemProps) => {
    const getStyle = createMemo(() => toBoxStyle(access(props.placement), access(props.stackAt)));

    return (
        <div class={styles.placementItem} style={getStyle()} role="presentation">
            {props.children}
        </div>
    );
};
