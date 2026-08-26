import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { CuboidFaceProps } from "./CuboidContent.types";

import * as styles from "./CuboidContent.css";

export const PageCuboidFace = (props: CuboidFaceProps) => {
    return (
        <div class={styles.cuboidFace[access(props.face)]}>
            <div class={styles.cuboidFaceTitle}>{access(props.face)}</div>
            <div class={styles.cuboidFaceBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageCuboidStack = (props: ParentProps) => <div class={styles.cuboidStack}>{props.children}</div>;

export const PageCuboidPad = (props: ParentProps) => <div class={styles.cuboidPad}>{props.children}</div>;
