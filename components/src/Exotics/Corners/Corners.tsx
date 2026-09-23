import { For, createMemo } from "solid-js";
import type { ParentProps } from "solid-js";

import { access } from "../../Utils/propUtils";
import { CORNERS_DEFAULTS } from "./Corners.const";
import type { CornersProps } from "./Corners.types";

import * as styles from "./Corners.css";

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
                style={{
                    color: getColor(),
                    filter: `drop-shadow(0 0 8px ${getColor()}) drop-shadow(0 0 16px ${getColor()})`,
                    transition: `color ${getTransitionDurationMs()}ms, filter ${getTransitionDurationMs()}ms`,
                }}
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
                                points={[
                                    `0,0`,
                                    `${getCornerLength().width},0`,
                                    `${getCornerLength().width - getStrokeThickness()},${getStrokeThickness()}`,
                                    `${getStrokeThickness()},${getStrokeThickness()}`,
                                    `${getStrokeThickness()},${getCornerLength().height - getStrokeThickness()}`,
                                    `0,${getCornerLength().height}`,
                                ].join(" ")}
                            />
                        </svg>
                    )}
                </For>
            </div>

            {props.children}
        </div>
    );
};
