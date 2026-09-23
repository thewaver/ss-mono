import { createUniqueId } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { PageCirclePackingCircleProps, PageCirclePackingLabelProps } from "./CirclePackingContent.types";

import * as styles from "./CirclePackingContent.css";

const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageCirclePackingCircle = (props: PageCirclePackingCircleProps) => {
    const gradientId = createUniqueId();

    return (
        <>
            <defs>
                <radialGradient id={gradientId} cx={0.7} cy={0.3} r={0.8}>
                    <stop
                        offset={0}
                        class={
                            access(props.state).isBranch
                                ? styles.circlePackingStopLight
                                : styles.circlePackingLeafStopLight
                        }
                    />
                    <stop
                        offset={1}
                        class={
                            access(props.state).isBranch
                                ? styles.circlePackingStopDark
                                : styles.circlePackingLeafStopDark
                        }
                    />
                </radialGradient>
            </defs>

            <circle
                class={styles.circlePackingCircle}
                classList={{ [styles.circlePackingBranch]: access(props.state).isBranch }}
                style={{ fill: `url(#${gradientId})` }}
                cx={access(props.state).x}
                cy={access(props.state).y}
                r={Math.max(0, access(props.state).radius)}
            >
                <title>{access(props.title)}</title>
            </circle>
        </>
    );
};

export const PageCirclePackingLabel = (props: PageCirclePackingLabelProps) => {
    return (
        <text
            class={styles.circlePackingLabel}
            style={{
                "fill-opacity": access(props.state).isInView ? LABEL_SHOWN : LABEL_HIDDEN,
                "stroke-opacity": access(props.state).isInView ? LABEL_SHOWN : LABEL_HIDDEN,
            }}
            x={access(props.state).x}
            y={access(props.state).y}
            text-anchor="middle"
            dy="0.35em"
        >
            {access(props.name)}
        </text>
    );
};
