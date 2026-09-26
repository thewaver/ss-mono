import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioContentProps } from "./RadioContent.types";

import * as styles from "./RadioContent.css";

export const PageRadioContent = (props: ParentProps<RadioContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.radioContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isChecked]: access(props.flags).checkedState === true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        >
            <div class={styles.radioMarker}>
                <div class={styles.radioDot} />
            </div>

            {props.children}
        </div>
    );
};
