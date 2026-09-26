import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { TimePickerTriggerProps } from "./TimePickerTrigger.types";

import * as styles from "./TimePickerTrigger.css";

export const PageTimePickerTrigger = (props: TimePickerTriggerProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.timePickerTrigger}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {"◷"}
        </div>
    );
};
