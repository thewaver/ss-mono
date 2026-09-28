import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuTriggerContent/MenuTriggerContent.css";

import type { MenuTriggerContentProps } from "./MenuTriggerContent.types";

export const PageMenuTriggerContent = (props: ParentProps<MenuTriggerContentProps>) => {
    return (
        <div
            class={styles.menuTriggerContent}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isOpen]: access(props.flags).isOpen,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            <div>{props.children}</div>
            <div class={styles.menuTriggerChevron} />
        </div>
    );
};
