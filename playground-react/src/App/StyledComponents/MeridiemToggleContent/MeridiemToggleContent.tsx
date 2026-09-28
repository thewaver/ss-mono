import * as styles from "@thewaver/ss-playground/App/StyledComponents/MeridiemToggleContent/MeridiemToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { MeridiemToggleContentProps } from "./MeridiemToggleContent.types";

export const PageMeridiemToggleContent = (props: MeridiemToggleContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.meridiemToggle,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.meridiem === "am" ? "AM" : "PM"}
        </div>
    );
};
