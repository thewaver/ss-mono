import { For, Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import type {
    PageTimelineBlockProps,
    PageTimelineFrameProps,
    PageTimelineLanesProps,
    PageTimelineMarkerProps,
    PageTimelineTickProps,
} from "./TimelineContent.types";

import * as styles from "./TimelineContent.css";

export const PageTimelineFrame = (props: PageTimelineFrameProps) => (
    <div class={styles.timelineFrame}>{props.children}</div>
);

export const PageTimelineRow = (props: PageTimelineFrameProps) => (
    <div class={styles.timelineRow}>{props.children}</div>
);

export const PageTimelineTrack = (props: PageTimelineFrameProps) => (
    <div class={styles.timelineTrack}>{props.children}</div>
);

export const PageTimelineControls = (props: PageTimelineFrameProps) => (
    <div class={styles.timelineControls}>{props.children}</div>
);

export const PageTimelineLanes = (props: PageTimelineLanesProps) => (
    <div class={styles.timelineLanes}>
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

export const PageTimelineTick = (props: PageTimelineTickProps) => (
    <>
        <div class={styles.timelineRule} classList={{ [styles.isMajor]: access(props.tick).isMajor }} />

        <div class={styles.timelineTickLabel}>{access(props.label)}</div>
    </>
);

export const PageTimelineMarker = (props: PageTimelineMarkerProps) => (
    <Show when={access(props.marker).isInView}>
        <div class={`${styles.timelineMarker} ${styles.timelineMarkerTones[access(props.tone)]}`} />
    </Show>
);

export const PageTimelineBlock = (props: PageTimelineBlockProps) => {
    const getFlags = () => access(props.flags);

    return (
        <div
            class={`${styles.timelineBlock} ${styles.timelineBlockTones[access(props.tone)]}`}
            classList={{
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
