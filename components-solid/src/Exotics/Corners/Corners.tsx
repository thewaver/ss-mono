import { For, createMemo } from "solid-js";
import type { ParentProps } from "solid-js";

import { CORNERS_DEFAULTS, CornerUtils, CornersStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { CornersProps } from "./CornersSolid.types";

export const Corners = (props: ParentProps<CornersProps>) => {
    const getColor = createMemo(() => access(props.color) ?? "currentColor");

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CORNERS_DEFAULTS.transitionDurationMs,
    );

    const getCornerLength = createMemo(() => access(props.cornerLength) ?? CORNERS_DEFAULTS.cornerLength);

    const getStrokeThickness = createMemo(() => access(props.strokeThickness) ?? CORNERS_DEFAULTS.strokeThickness);

    const getVisibleCorners = createMemo(() => [...(access(props.visibleCorners) ?? CORNERS_DEFAULTS.visibleCorners)]);

    return (
        <div class={styles.cornersRoot}>
            <div
                class={styles.cornersGlow}
                style={CornerUtils.computeGlowStyle(getColor(), getTransitionDurationMs())}
                aria-hidden="true"
            >
                <For each={getVisibleCorners()}>
                    {(cornerKey) => (
                        <svg
                            class={`${styles.cornerSVG} ${styles.cornerVariant[cornerKey]}`}
                            width={getCornerLength().width}
                            height={getCornerLength().height}
                            viewBox={`0 0 ${getCornerLength().width} ${getCornerLength().height}`}
                            overflow="visible"
                        >
                            <polygon
                                fill="currentColor"
                                points={CornerUtils.computeArmPoints(getCornerLength(), getStrokeThickness())}
                            />
                        </svg>
                    )}
                </For>
            </div>

            {props.children}
        </div>
    );
};
