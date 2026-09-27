import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/ToggleContent/ToggleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ToggleContentProps } from "./ToggleContent.types";

export const PageToggleContent = (props: ToggleContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.toggleContent,
                layerClass,
                props.flags.checkedState === true && styles.isChecked,
                props.flags.checkedState === "mixed" && styles.isMixed,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.toggleHandle} />
        </div>
    );
};
