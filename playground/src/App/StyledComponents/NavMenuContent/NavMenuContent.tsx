import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { NavMenuTriggerProps } from "./NavMenuContent.types";

import * as styles from "./NavMenuContent.css";

export const PageNavMenuTrigger = (props: ParentProps<NavMenuTriggerProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <span
            class={styles.navMenuTrigger}
            classList={{
                [getLayerClass()]: true,
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
