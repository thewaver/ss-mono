import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CheckboxContent/CheckboxContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CheckboxContentProps } from "./CheckboxContentSolid.types";

export const PageCheckboxContent = (props: ParentProps<CheckboxContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.checkboxContent}
            classList={{
                [getLayerClass()]: true,
                [styles.isChecked]: access(props.flags).checkedState === true,
                [styles.isMixed]: access(props.flags).checkedState === "mixed",
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
            aria-hidden="true"
        >
            <div class={styles.checkboxBox}>
                <div class={styles.checkboxMark}>
                    {access(props.flags).checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            </div>

            {props.children}
        </div>
    );
};
