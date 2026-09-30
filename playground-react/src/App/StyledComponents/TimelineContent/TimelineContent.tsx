import * as styles from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PageTimelineBlockProps,
    PageTimelineFrameProps,
    PageTimelineLanesProps,
    PageTimelineMarkerProps,
    PageTimelineTickProps,
} from "./TimelineContent.types";

export const PageTimelineFrame = (props: PageTimelineFrameProps) => {
    const layerClass = useLayerClass();

    return <div className={[styles.timelineFrame, layerClass].join(" ")}>{props.children}</div>;
};

export const PageTimelineRow = (props: PageTimelineFrameProps) => {
    const layerClass = useLayerClass();

    return <div className={[styles.timelineRow, layerClass].join(" ")}>{props.children}</div>;
};

export const PageTimelineTrack = (props: PageTimelineFrameProps) => {
    const layerClass = useLayerClass();

    return <div className={[styles.timelineTrack, layerClass].join(" ")}>{props.children}</div>;
};

export const PageTimelineControls = (props: PageTimelineFrameProps) => {
    const layerClass = useLayerClass();

    return <div className={[styles.timelineControls, layerClass].join(" ")}>{props.children}</div>;
};

export const PageTimelineLanes = (props: PageTimelineLanesProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.timelineLanes, layerClass].join(" ")}>
            {props.names.map((name, index) => (
                <div
                    key={index}
                    className={styles.timelineLaneName}
                    style={{
                        height: `${props.laneSize}px`,
                        marginTop: index === 0 ? undefined : `${props.laneGap}px`,
                    }}
                >
                    {name}
                </div>
            ))}
        </div>
    );
};

export const PageTimelineTick = (props: PageTimelineTickProps) => {
    const layerClass = useLayerClass();

    return (
        <>
            <div
                className={[styles.timelineRule, layerClass, props.tick.isMajor && styles.isMajor]
                    .filter(Boolean)
                    .join(" ")}
            />

            <div className={[styles.timelineTickLabel, layerClass].join(" ")}>{props.label}</div>
        </>
    );
};

export const PageTimelineMarker = (props: PageTimelineMarkerProps) => {
    const layerClass = useLayerClass();

    return props.marker.isInView ? (
        <div className={[`${styles.timelineMarker} ${styles.timelineMarkerTones[props.tone]}`, layerClass].join(" ")} />
    ) : null;
};

export const PageTimelineBlock = (props: PageTimelineBlockProps) => {
    const layerClass = useLayerClass();

    const flags = props.flags;

    return (
        <div
            className={[
                `${styles.timelineBlock} ${styles.timelineBlockFamily[props.family]}`,
                layerClass,
                flags.isHovered && styles.isHovered,
                flags.isFocusVisible && styles.isFocusVisible,
                flags.isDisabled && styles.isDisabled,
                flags.heldEdge === "start" && styles.isHeldStart,
                flags.heldEdge === "end" && styles.isHeldEnd,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.timelineBlockName}>{props.name}</span>
            <span className={styles.timelineBlockNote}>{props.note}</span>
        </div>
    );
};
