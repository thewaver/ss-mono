import { For, Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PageTimelineBlockProps,
    PageTimelineFrameProps,
    PageTimelineLanesProps,
    PageTimelineMarkerProps,
    PageTimelineTickProps,
} from "./TimelineContent.types";

import * as styles from "./TimelineContent.css";

export const PageTimelineFrame = (props: PageTimelineFrameProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.timelineFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageTimelineRow = (props: PageTimelineFrameProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.timelineRow, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageTimelineTrack = (props: PageTimelineFrameProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.timelineTrack, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageTimelineControls = (props: PageTimelineFrameProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.timelineControls, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageTimelineLanes = (props: PageTimelineLanesProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.timelineLanes, getLayerClass()].join(" ")}>
            <For each={access(props.names)}>
                {(name, index) => (
                    <div
                        class={styles.timelineLaneName}
                        style={{
                            "height": `${access(props.laneSize)}px`,
                            "margin-top": index() === 0 ? undefined : `${access(props.laneGap)}px`,
                        }}
                    >
                        {name}
                    </div>
                )}
            </For>
        </div>
    );
};

export const PageTimelineTick = (props: PageTimelineTickProps) => {
    const getLayerClass = useLayerClass();

    return (
        <>
            <div
                class={styles.timelineRule}
                classList={{ [getLayerClass()]: true, [styles.isMajor]: access(props.tick).isMajor }}
            />

            <div class={[styles.timelineTickLabel, getLayerClass()].join(" ")}>{access(props.label)}</div>
        </>
    );
};

export const PageTimelineMarker = (props: PageTimelineMarkerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <Show when={access(props.marker).isInView}>
            <div
                class={`${styles.timelineMarker} ${styles.timelineMarkerTones[access(props.tone)]}`}
                classList={{ [getLayerClass()]: true }}
            />
        </Show>
    );
};

export const PageTimelineBlock = (props: PageTimelineBlockProps) => {
    const getLayerClass = useLayerClass();

    const getFlags = () => access(props.flags);

    return (
        <div
            class={`${styles.timelineBlock} ${styles.timelineBlockTones[access(props.tone)]}`}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: getFlags().isHovered,
                [styles.isFocusVisible]: getFlags().isFocusVisible,
                [styles.isDisabled]: getFlags().isDisabled,
                [styles.isHeldStart]: getFlags().heldEdge === "start",
                [styles.isHeldEnd]: getFlags().heldEdge === "end",
            }}
        >
            <span class={styles.timelineBlockName}>{access(props.name)}</span>
            <span class={styles.timelineBlockNote}>{access(props.note)}</span>
        </div>
    );
};
