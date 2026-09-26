import type { ParentProps } from "solid-js";
import { createUniqueId } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageCirclePackingCircleProps, PageCirclePackingLabelProps } from "./CirclePackingContent.types";

import * as styles from "./CirclePackingContent.css";

const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageCirclePackingCircle = (props: PageCirclePackingCircleProps) => {
    const getLayerClass = useLayerClass();

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
                classList={{ [getLayerClass()]: true, [styles.circlePackingBranch]: access(props.state).isBranch }}
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
    const getLayerClass = useLayerClass();

    return (
        <text
            class={[styles.circlePackingLabel, getLayerClass()].join(" ")}
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

export const PageCirclePackingFrame = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.circlePackingFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};
