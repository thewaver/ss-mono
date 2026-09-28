import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { HoverCardContentProps } from "./HoverCardContent.types";

export const PageHoverCardContent = (props: ParentProps<HoverCardContentProps>) => {
    return (
        <div
            class={styles.hoverCardContent}
            classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ transition: `opacity ${access(props.transitionDurationMs)}ms` }}
        >
            <PageLayer level={2}>{props.children}</PageLayer>
        </div>
    );
};
