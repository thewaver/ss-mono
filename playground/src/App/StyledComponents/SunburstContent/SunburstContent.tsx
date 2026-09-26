import { createUniqueId } from "solid-js";

import { SunburstUtils, access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageSunburstArcProps, PageSunburstHubProps } from "./SunburstContent.types";

import * as styles from "./SunburstContent.css";

const PAD_LENGTH = 1;
const RING_GAP = 1;
const MIN_LABEL_ANGLE = 0.03;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

export const PageSunburstArc = (props: PageSunburstArcProps) => {
    const getLayerClass = useLayerClass();

    const gradientId = createUniqueId();

    const getIsLabelShown = () => access(props.state).endAngle - access(props.state).startAngle > MIN_LABEL_ANGLE;

    return (
        <>
            <defs>
                <linearGradient id={gradientId} x1={1} y1={0} x2={0} y2={1}>
                    <stop offset={0} class={styles.sunburstStopLight[access(props.family)]} />
                    <stop offset={1} class={styles.sunburstStopDark[access(props.family)]} />
                </linearGradient>
            </defs>

            <path
                class={styles.sunburstArc}
                classList={{ [getLayerClass()]: true, [styles.sunburstArcBranch]: access(props.state).isBranch }}
                style={{ fill: `url(#${gradientId})` }}
                d={SunburstUtils.computeArcPath(access(props.state), { padLength: PAD_LENGTH, ringGap: RING_GAP })}
            >
                <title>{access(props.title)}</title>
            </path>

            <text
                class={`${styles.sunburstText} ${styles.sunburstLabel[access(props.family)]}`}
                style={{ "fill-opacity": getIsLabelShown() ? LABEL_SHOWN : LABEL_HIDDEN }}
                transform={SunburstUtils.computeLabelTransform(access(props.state))}
                text-anchor="middle"
                dy="0.35em"
            >
                {access(props.name)}
            </text>
        </>
    );
};

export const PageSunburstHub = (props: PageSunburstHubProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.sunburstHub}
            classList={{
                [getLayerClass()]: true,
                [styles.sunburstHubHovered]: access(props.flags).isHovered,
                [styles.sunburstHubAtRoot]: access(props.flags).isDisabled,
            }}
        >
            <span class={styles.sunburstHubName}>{access(props.name)}</span>

            <span class={styles.sunburstHubWeight}>{access(props.weight)}</span>
        </div>
    );
};
