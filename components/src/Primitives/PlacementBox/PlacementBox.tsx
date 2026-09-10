import { createMemo } from "solid-js";

import { PlacementUtils } from "../../Abstracts/Placement/Placement.utils";
import { access } from "../../Utils/propUtils";
import type { PlacementBoxProps } from "./PlacementBox.types";

import * as styles from "./PlacementBox.css";

export const PlacementBox = (props: PlacementBoxProps) => {
    const getLayout = createMemo(() => access(props.layout));

    return (
        <div ref={(element) => props.ref?.(element)} class={styles.placementBox} role="presentation">
            <div
                class={styles.placementSpacer}
                style={{ height: PlacementUtils.toContainerWidth(getLayout().heightRatio) }}
                aria-hidden="true"
            />

            {props.children}
        </div>
    );
};
