import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { ToggleContentProps } from "./ToggleContent.types";

import * as styles from "./ToggleContent.css";

export const PageToggleContent = (props: ToggleContentProps) => {
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
        >
            <div class={styles.toggleHandle} />
        </div>
    );
};
