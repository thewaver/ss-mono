import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectOptionContentProps } from "./SelectOptionContent.types";

export const PageSelectOptionContent = (props: PropsWithChildren<SelectOptionContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.selectOptionContent,
                layerClass,
                !props.isGliding && props.flags.isHovered && styles.isHovered,
                !props.isGliding && props.flags.isHighlighted && styles.isHighlighted,
                props.flags.isSelected && styles.isSelected,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={styles.selectOptionText}>
                <div>{props.children}</div>

                {props.description ? <div className={styles.selectOptionDescription}>{props.description}</div> : null}
            </div>

            <div className={styles.selectOptionMark} aria-hidden="true">
                ✓
            </div>
        </div>
    );
};
