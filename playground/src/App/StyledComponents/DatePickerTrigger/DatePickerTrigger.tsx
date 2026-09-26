import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";

import * as styles from "./DatePickerTrigger.css";

export const PageDatePickerTrigger = (props: DatePickerTriggerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.datePickerTrigger}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {"▦"}
        </div>
    );
};
