import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { ClockOptionProps } from "./ClockContent.types";

import * as styles from "./ClockContent.css";

export const PageClockOption = (props: ClockOptionProps) => {
    return (
        <div
            class={styles.clockOption}
            classList={{
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

export const PageClockUnit = (props: ParentProps) => <div class={styles.clockUnit}>{props.children}</div>;

export const PageClockColumn = (props: ParentProps) => <div class={styles.clockColumn}>{props.children}</div>;

export const PageClockFrame = (props: ParentProps) => <div class={styles.clockFrame}>{props.children}</div>;
