import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectClear/SelectClear.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectClearProps } from "./SelectClear.types";

export const PageSelectClear = (props: SelectClearProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.selectClear,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            ×
        </div>
    );
};
