import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/SelectClear/SelectClear.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectClearProps } from "./SelectClear.types";

export const PageSelectClear = (props: SelectClearProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.selectClear}
            classList={{
                [getLayerClass()]: true,
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
