import { access } from "@thewaver/ss-components";

import type { SelectClearProps } from "./SelectClear.types";

import * as styles from "./SelectClear.css";

export const PageSelectClear = (props: SelectClearProps) => {
    return (
        <div
            class={styles.selectClear}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            ×
        </div>
    );
};
