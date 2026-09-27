import type { PropsWithChildren } from "react";
import { useId } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/CirclePackingContent/CirclePackingContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageCirclePackingCircleProps, PageCirclePackingLabelProps } from "./CirclePackingContent.types";

const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageCirclePackingCircle = (props: PageCirclePackingCircleProps) => {
    const layerClass = useLayerClass();

    const gradientId = useId();

    return (
        <>
            <defs>
                <radialGradient id={gradientId} cx={0.7} cy={0.3} r={0.8}>
                    <stop
                        offset={0}
                        className={
                            props.state.isBranch ? styles.circlePackingStopLight : styles.circlePackingLeafStopLight
                        }
                    />
                    <stop
                        offset={1}
                        className={
                            props.state.isBranch ? styles.circlePackingStopDark : styles.circlePackingLeafStopDark
                        }
                    />
                </radialGradient>
            </defs>

            <circle
                className={[styles.circlePackingCircle, layerClass, props.state.isBranch && styles.circlePackingBranch]
                    .filter(Boolean)
                    .join(" ")}
                style={{ fill: `url(#${gradientId})` }}
                cx={props.state.x}
                cy={props.state.y}
                r={Math.max(0, props.state.radius)}
            >
                <title>{props.title}</title>
            </circle>
        </>
    );
};

export const PageCirclePackingLabel = (props: PageCirclePackingLabelProps) => {
    const layerClass = useLayerClass();

    return (
        <text
            className={[styles.circlePackingLabel, layerClass].join(" ")}
            style={{
                fillOpacity: props.state.isInView ? LABEL_SHOWN : LABEL_HIDDEN,
                strokeOpacity: props.state.isInView ? LABEL_SHOWN : LABEL_HIDDEN,
            }}
            x={props.state.x}
            y={props.state.y}
            textAnchor="middle"
            dy="0.35em"
        >
            {props.name}
        </text>
    );
};

export const PageCirclePackingFrame = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.circlePackingFrame, layerClass].join(" ")}>{props.children}</div>;
};
