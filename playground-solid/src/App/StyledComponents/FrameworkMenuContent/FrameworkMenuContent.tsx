import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FrameworkMenuContent/FrameworkMenuContent.css";
import * as optionStyles from "@thewaver/ss-playground/App/StyledComponents/SelectOptionContent/SelectOptionContent.css";

import { useLayerClass } from "../Layer/Layer.context";

import type { FrameworkMenuItemProps, FrameworkMenuTriggerProps } from "./FrameworkMenuContent.types";

export const PageFrameworkMenuTrigger = (props: ParentProps<FrameworkMenuTriggerProps>) => {
    return (
        <span
            class={styles.frameworkMenuTrigger}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
            }}
        >
            <span class={styles.frameworkMenuName}>{props.children}</span>

            <span class={styles.frameworkMenuChevron} aria-hidden="true">
                {access(props.flags).isOpen ? "▴" : "▾"}
            </span>
        </span>
    );
};

export const PageFrameworkMenuItem = (props: ParentProps<FrameworkMenuItemProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={optionStyles.selectOptionContent}
            classList={{
                [getLayerClass()]: true,
                [optionStyles.isHovered]: access(props.flags).isHovered,
                [optionStyles.isHighlighted]: access(props.flags).isHighlighted,
                [optionStyles.isSelected]: access(props.flags).isChecked,
                [optionStyles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <div>{props.children}</div>

            <div class={optionStyles.selectOptionMark} aria-hidden="true">
                ✓
            </div>
        </div>
    );
};
