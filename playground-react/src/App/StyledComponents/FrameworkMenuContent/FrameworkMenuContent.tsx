import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/FrameworkMenuContent/FrameworkMenuContent.css";
import * as optionStyles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FrameworkMenuItemProps, FrameworkMenuTriggerProps } from "./FrameworkMenuContent.types";

export const PageFrameworkMenuTrigger = (props: PropsWithChildren<FrameworkMenuTriggerProps>) => {
    return (
        <span
            className={[
                styles.frameworkMenuTrigger,
                props.flags.isHovered && styles.isHovered,
                props.flags.isOpen && styles.isOpen,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.frameworkMenuName}>{props.children}</span>

            <span className={styles.frameworkMenuChevron} aria-hidden="true">
                {props.flags.isOpen ? "▴" : "▾"}
            </span>
        </span>
    );
};

export const PageFrameworkMenuItem = (props: PropsWithChildren<FrameworkMenuItemProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                optionStyles.selectOptionContent,
                layerClass,
                props.flags.isHovered && optionStyles.isHovered,
                props.flags.isHighlighted && optionStyles.isHighlighted,
                props.flags.isChecked && optionStyles.isSelected,
                props.flags.isDisabled && optionStyles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div>{props.children}</div>

            <div className={optionStyles.selectOptionMark} aria-hidden="true">
                ✓
            </div>
        </div>
    );
};
