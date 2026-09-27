import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TimePickerTrigger/TimePickerTrigger.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TimePickerTriggerProps } from "./TimePickerTrigger.types";

export const PageTimePickerTrigger = (props: TimePickerTriggerProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.timePickerTrigger,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {"◷"}
        </div>
    );
};
