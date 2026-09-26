import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { MeridiemToggleContentProps } from "./MeridiemToggleContent.types";

import * as styles from "./MeridiemToggleContent.css";

export const PageMeridiemToggleContent = (props: MeridiemToggleContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.meridiemToggle}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.meridiem) === "am" ? "AM" : "PM"}
        </div>
    );
};
