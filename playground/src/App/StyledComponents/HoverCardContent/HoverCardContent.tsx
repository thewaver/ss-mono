import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { HoverCardContentProps } from "./HoverCardContent.types";

import * as styles from "./HoverCardContent.css";

export const PageHoverCardContent = (props: ParentProps<HoverCardContentProps>) => {
    return (
        <div
            class={styles.hoverCardContent}
            classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ transition: `opacity ${access(props.transitionDurationMs)}ms` }}
        >
            {props.children}
        </div>
    );
};
