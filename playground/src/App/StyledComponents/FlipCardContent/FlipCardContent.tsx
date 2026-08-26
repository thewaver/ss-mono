import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { FlipCardFaceProps } from "./FlipCardContent.types";

import * as styles from "./FlipCardContent.css";

export const PageFlipCardFront = (props: ParentProps<FlipCardFaceProps>) => {
    return (
        <div class={styles.flipCardFront}>
            <div class={styles.flipCardTitle}>{props.children}</div>
            <div class={styles.flipCardBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardBack = (props: ParentProps<FlipCardFaceProps>) => {
    return (
        <div class={styles.flipCardBack}>
            <div class={styles.flipCardTitle}>{props.children}</div>
            <div class={styles.flipCardBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardStack = (props: ParentProps) => <div class={styles.flipCardStack}>{props.children}</div>;
