import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ToggleContent/ToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ToggleContentProps } from "./ToggleContentSolid.types";

export const PageToggleContent = (props: ParentProps<ToggleContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.toggleContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isChecked]: access(props.flags).checkedState === true,
                [styles.isMixed]: access(props.flags).checkedState === "mixed",
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
            aria-hidden="true"
        >
            <div class={styles.toggleTrack}>
                <div class={styles.toggleHandle} />
            </div>

            {props.children}
        </div>
    );
};
