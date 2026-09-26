import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { ClockOptionProps } from "./ClockContent.types";

import * as styles from "./ClockContent.css";

export const PageClockOption = (props: ClockOptionProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.clockOption}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isNow]: access(props.renderProps).isNow,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.renderProps).option.label}
        </div>
    );
};

export const PageClockUnit = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.clockUnit, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageClockColumn = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.clockColumn, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageClockFrame = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.clockFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};
