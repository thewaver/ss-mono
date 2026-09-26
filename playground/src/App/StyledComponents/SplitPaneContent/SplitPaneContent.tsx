import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { SplitPaneCompareProps, SplitPaneGutterProps } from "./SplitPaneContent.types";

import * as styles from "./SplitPaneContent.css";

export const PageSplitPaneGutter = (props: SplitPaneGutterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={access(props.orientation) === "horizontal" ? styles.rowGutter : styles.columnGutter}
            classList={{
                [getLayerClass()]: true,
                [styles.isDragging]: access(props.flags).isDragging,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            data-gutter
        >
            <div class={access(props.orientation) === "horizontal" ? styles.rowGrip : styles.columnGrip} />
        </div>
    );
};

export const PageSplitPaneBox = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.splitPaneBox, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneFrame = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.splitPaneFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneCompareFrame = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.compareFrame, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageSplitPaneCompareBox = (props: SplitPaneCompareProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.compareBox, getLayerClass()].join(" ")}>
            <img
                class={access(props.side) === "start" ? styles.compareStartImage : styles.compareEndImage}
                src={access(props.src)}
                alt={access(props.alt)}
            />
        </div>
    );
};
