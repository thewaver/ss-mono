import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/DatePickerTrigger/DatePickerTrigger.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";

export const PageDatePickerTrigger = (props: DatePickerTriggerProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.datePickerTrigger,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {"▦"}
        </div>
    );
};
