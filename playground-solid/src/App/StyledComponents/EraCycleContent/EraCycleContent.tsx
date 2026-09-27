import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/EraCycleContent/EraCycleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { EraCycleContentProps } from "./EraCycleContent.types";

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
