import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { ColorInputContentProps } from "./ColorInputContent.types";

import * as styles from "./ColorInputContent.css";

export const PageColorInputContent = (props: ColorInputContentProps) => {
    return (
        <div
            class={styles.colorInputContent}
            classList={{
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.hasError]: access(props.renderProps).hasError,
            }}
            aria-hidden="true"
        >
            <div class={styles.colorInputSwatch} style={{ "background-color": access(props.renderProps).value }} />

            <Show when={!access(props.isCompact)}>
                <div class={styles.colorInputValue}>{access(props.renderProps).value}</div>
            </Show>
        </div>
    );
};
