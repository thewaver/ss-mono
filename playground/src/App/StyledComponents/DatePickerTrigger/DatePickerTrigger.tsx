import { access } from "@thewaver/ss-components";

import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";

import * as styles from "./DatePickerTrigger.css";

export const PageDatePickerTrigger = (props: DatePickerTriggerProps) => {
    return (
        <div
            class={styles.datePickerTrigger}
            classList={{
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
