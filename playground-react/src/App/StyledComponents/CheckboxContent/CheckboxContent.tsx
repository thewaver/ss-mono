import type { PropsWithChildren } from "react";

import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CheckboxContentProps } from "./CheckboxContentReact.types";

export const PageCheckboxContent = (props: PropsWithChildren<CheckboxContentProps>) => {
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
            aria-hidden="true"
        >
            <div className={styles.checkboxBox}>
                <div className={styles.checkboxMark}>
                    {props.flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            </div>

            {props.children}
        </div>
    );
};
