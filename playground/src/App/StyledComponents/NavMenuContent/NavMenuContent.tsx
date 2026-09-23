import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { NavMenuTriggerProps } from "./NavMenuContent.types";

import * as styles from "./NavMenuContent.css";

export const PageNavMenuTrigger = (props: ParentProps<NavMenuTriggerProps>) => {
    return (
        <span
            class={styles.navMenuTrigger}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isOpen]: access(props.flags).isOpen,
            }}
        >
            {props.children}

            <span class={styles.navMenuChevron} aria-hidden="true">
                {"▾"}
            </span>
        </span>
    );
};
