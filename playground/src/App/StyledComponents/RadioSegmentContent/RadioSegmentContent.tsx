import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioSegmentContentProps, RadioSegmentFloaterProps } from "./RadioSegmentContent.types";

import * as styles from "./RadioSegmentContent.css";

export const PageRadioSegmentGroup = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.segmentGroup, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageRadioSegmentContent = (props: ParentProps<RadioSegmentContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.segmentContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isChecked]: access(props.flags).checkedState === true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageRadioSegmentFloater = (props: RadioSegmentFloaterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.segmentFloater}
            classList={{ [getLayerClass()]: true, [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
            data-floater
        />
    );
};
