import { For, createMemo } from "solid-js";
import type { ParentProps } from "solid-js";

import { CORNER_HIGHLIGHT_DEFAULTS, CornerUtils, CornerHighlightStyles as styles } from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { CornerHighlightProps } from "./CornerHighlightSolid.types";

export const CornerHighlight = (props: ParentProps<CornerHighlightProps>) => {
    const getColor = createMemo(() => access(props.color) ?? "currentColor");

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs,
    );

    const getCornerLength = createMemo(() => access(props.cornerLength) ?? CORNER_HIGHLIGHT_DEFAULTS.cornerLength);

    const getStrokeThickness = createMemo(
        () => access(props.strokeThickness) ?? CORNER_HIGHLIGHT_DEFAULTS.strokeThickness,
    );

    const getVisibleCorners = createMemo(() => [
        ...(access(props.visibleCorners) ?? CORNER_HIGHLIGHT_DEFAULTS.visibleCorners),
    ]);

    return (
        <div class={styles.cornerHighlightRoot}>
            <div
                class={styles.cornerHighlightGlow}
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
