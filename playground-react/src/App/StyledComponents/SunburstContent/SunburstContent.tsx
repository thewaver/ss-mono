import { useId } from "react";

import { SunburstUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SunburstContent/SunburstContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSunburstArcProps, PageSunburstHubProps } from "./SunburstContent.types";

const PAD_LENGTH = 1;
const RING_GAP = 1;
const MIN_LABEL_ANGLE = 0.03;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageSunburstArc = (props: PageSunburstArcProps) => {
    const layerClass = useLayerClass();

    const gradientId = useId();

    const isLabelShown = props.state.endAngle - props.state.startAngle > MIN_LABEL_ANGLE;

    return (
        <>
            <defs>
                <linearGradient id={gradientId} x1={1} y1={0} x2={0} y2={1}>
                    <stop offset={0} className={styles.sunburstStopLight[props.family]} />
                    <stop offset={1} className={styles.sunburstStopDark[props.family]} />
                </linearGradient>
            </defs>

            <path
                className={[styles.sunburstArc, layerClass, props.state.isBranch && styles.sunburstArcBranch]
                    .filter(Boolean)
                    .join(" ")}
                style={{ fill: `url(#${gradientId})` }}
                d={SunburstUtils.computeArcPath(props.state, { padLength: PAD_LENGTH, ringGap: RING_GAP })}
            >
                <title>{props.title}</title>
            </path>

            <text
                className={`${styles.sunburstText} ${styles.sunburstLabel[props.family]}`}
                style={{ fillOpacity: isLabelShown ? LABEL_SHOWN : LABEL_HIDDEN }}
                transform={SunburstUtils.computeLabelTransform(props.state)}
                textAnchor="middle"
                dy="0.35em"
            >
                {props.name}
            </text>
        </>
    );
};

export const PageSunburstHub = (props: PageSunburstHubProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.sunburstHub,
                layerClass,
                props.flags.isHovered && styles.sunburstHubHovered,
                props.flags.isDisabled && styles.sunburstHubAtRoot,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.sunburstHubName}>{props.name}</span>

            <span className={styles.sunburstHubWeight}>{props.weight}</span>
        </div>
    );
};
