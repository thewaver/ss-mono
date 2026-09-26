import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { RadioStarContentProps } from "./RadioStarContent.types";

import * as styles from "./RadioStarContent.css";

export const PageRadioStarContent = (props: RadioStarContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.starContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isFilled]: access(props.isFilled),
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        >
            <span aria-hidden="true">★</span>
        </div>
    );
};

export const PageRadioStarCell = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.starCell, getLayerClass()].join(" ")}>{props.children}</div>;
};
