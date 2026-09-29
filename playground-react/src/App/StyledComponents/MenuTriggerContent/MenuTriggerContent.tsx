import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuTriggerContent/MenuTriggerContent.css";

import type { MenuTriggerContentProps } from "./MenuTriggerContent.types";

export const PageMenuTriggerContent = (props: PropsWithChildren<MenuTriggerContentProps>) => {
    return (
        <div
            className={[
                styles.menuTriggerContent,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isOpen && styles.isOpen,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div>{props.children}</div>
            <div className={styles.menuTriggerChevron} />
        </div>
    );
};
