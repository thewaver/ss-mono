import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SegmentedInputContent/SegmentedInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SegmentedInputCellProps } from "./SegmentedInputContent.types";

export const PageSegmentedInputCell = (props: SegmentedInputCellProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.segmentedInputCell}
            classList={{
                [getLayerClass()]: true,
                [styles.hasCaret]: access(props.renderProps).hasCaret && access(props.renderProps).isFocusVisible,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [fieldStyles.isHovered]: access(props.renderProps).isHovered,
                [fieldStyles.isDisabled]: access(props.renderProps).isDisabled,
                [fieldStyles.hasError]: access(props.renderProps).hasError,
            }}
            data-has-caret={access(props.renderProps).hasCaret || undefined}
            data-selected={access(props.renderProps).isSelected || undefined}
        >
            {access(props.renderProps).char ?? ""}
        </div>
    );
};
