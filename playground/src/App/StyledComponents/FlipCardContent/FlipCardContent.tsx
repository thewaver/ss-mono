import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlipCardFaceProps } from "./FlipCardContent.types";

import * as styles from "./FlipCardContent.css";

export const PageFlipCardFront = (props: ParentProps<FlipCardFaceProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.flipCardFront, getLayerClass()].join(" ")}>
            <div class={styles.flipCardTitle}>{props.children}</div>
            <div class={styles.flipCardBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardBack = (props: ParentProps<FlipCardFaceProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.flipCardBack, getLayerClass()].join(" ")}>
            <div class={styles.flipCardTitle}>{props.children}</div>
            <div class={styles.flipCardBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardStack = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.flipCardStack, getLayerClass()].join(" ")}>{props.children}</div>;
};
