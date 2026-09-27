import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/CheckboxContent/CheckboxContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CheckboxContentProps } from "./CheckboxContent.types";

const CHECKED_MARK = "✓";
const MIXED_MARK = "–";

export const PageCheckboxContent = (props: CheckboxContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.checkboxContent,
                layerClass,
                props.flags.checkedState === true && styles.isChecked,
                props.flags.checkedState === "mixed" && styles.isMixed,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.checkboxMark} aria-hidden="true">
                {props.flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
            </div>
        </div>
    );
};
