import * as styles from "@thewaver/ss-playground/App/StyledComponents/SegmentedInputContent/SegmentedInputContent.css";
import * as fieldStyles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SegmentedInputCellProps } from "./SegmentedInputContent.types";

export const PageSegmentedInputCell = (props: SegmentedInputCellProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.segmentedInputCell,
                layerClass,
                props.renderProps.hasCaret && props.renderProps.isFocusVisible && styles.hasCaret,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isHovered && fieldStyles.isHovered,
                props.renderProps.isDisabled && fieldStyles.isDisabled,
                props.renderProps.hasError && fieldStyles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            data-has-caret={props.renderProps.hasCaret || undefined}
            data-selected={props.renderProps.isSelected || undefined}
        >
            {props.renderProps.char ?? ""}
        </div>
    );
};
