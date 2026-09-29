import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MeridiemToggleContent/MeridiemToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { MeridiemToggleContentProps } from "./MeridiemToggleContent.types";

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
