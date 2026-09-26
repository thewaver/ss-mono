import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { EraCycleContentProps } from "./EraCycleContent.types";

import * as styles from "./EraCycleContent.css";

export const PageEraCycleContent = (props: ParentProps<EraCycleContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.eraCycle}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};
