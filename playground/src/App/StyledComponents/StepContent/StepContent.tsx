import { type ParentProps, Show } from "solid-js";

import { PlacementUtils, access } from "@thewaver/ss-components";

import type { StepArcConnectorProps, StepConnectorProps, StepContentProps } from "./StepContent.types";

import * as styles from "./StepContent.css";

const MARKER_GLYPHS = {
    done: "✓",
    current: "",
    failed: "!",
    skipped: "–",
    ahead: "",
} as const;

export const PageStepContent = (props: ParentProps<StepContentProps>) => {
    return (
        <div
            class={access(props.dir) === "row" ? styles.rowStep : styles.columnStep}
            classList={{
                [styles.isCurrent]: access(props.flags).isCurrent,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <span class={styles.marker[access(props.state)]} aria-hidden="true">
                {MARKER_GLYPHS[access(props.state)] || access(props.ordinal)}
            </span>

            {props.children}
        </div>
    );
};

export const PageStepConnector = (props: StepConnectorProps) => {
    const getColumnClass = () => (access(props.isRail) === true ? styles.columnRailConnector : styles.columnConnector);

    return <span class={access(props.dir) === "row" ? styles.rowConnector : getColumnClass()} />;
};

export const PageStepArcCell = (props: ParentProps) => <div class={styles.arcCell}>{props.children}</div>;

export const PageStepArcConnector = (props: StepArcConnectorProps) => {
    const getRun = () => {
        const defs = access(props.defs);

        return defs.from === undefined || defs.to === undefined
            ? undefined
            : PlacementUtils.getLinkPath(defs.from, defs.to, defs.origin);
    };

    return (
        <Show when={getRun()}>
            {(getPath) => (
                <svg class={styles.arcConnector} viewBox={"0 0 1 1"} aria-hidden={"true"}>
                    <path class={styles.arcConnectorPath} d={getPath()} />
                </svg>
            )}
        </Show>
    );
};

export const PageStepBody = (props: ParentProps) => <div class={styles.stepBody}>{props.children}</div>;
