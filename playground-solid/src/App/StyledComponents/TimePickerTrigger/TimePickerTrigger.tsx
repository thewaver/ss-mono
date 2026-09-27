import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TimePickerTrigger/TimePickerTrigger.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TimePickerTriggerProps } from "./TimePickerTrigger.types";

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
