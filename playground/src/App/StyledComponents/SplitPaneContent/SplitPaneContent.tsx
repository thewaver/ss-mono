import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { SplitPaneCompareProps, SplitPaneGutterProps } from "./SplitPaneContent.types";

import * as styles from "./SplitPaneContent.css";

export const PageSplitPaneGutter = (props: SplitPaneGutterProps) => {
    return (
        <div
            class={access(props.dir) === "row" ? styles.rowGutter : styles.columnGutter}
            classList={{
                [styles.isDragging]: access(props.flags).isDragging,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            data-gutter
        >
            <div class={access(props.dir) === "row" ? styles.rowGrip : styles.columnGrip} />
        </div>
    );
};

export const PageSplitPaneBox = (props: ParentProps) => <div class={styles.splitPaneBox}>{props.children}</div>;

export const PageSplitPaneFrame = (props: ParentProps) => <div class={styles.splitPaneFrame}>{props.children}</div>;

export const PageSplitPaneCompareFrame = (props: ParentProps) => (
    <div class={styles.compareFrame}>{props.children}</div>
);

export const PageSplitPaneCompareBox = (props: SplitPaneCompareProps) => (
    <div class={styles.compareBox}>
        <img
            class={access(props.side) === "start" ? styles.compareStartImage : styles.compareEndImage}
            src={access(props.src)}
            alt={access(props.alt)}
        />
    </div>
);
