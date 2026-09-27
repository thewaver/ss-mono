import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { HoverCardContentProps } from "./HoverCardContent.types";

export const PageHoverCardContent = (props: PropsWithChildren<HoverCardContentProps>) => {
    return (
        <div
            className={[styles.hoverCardContent, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transition: `opacity ${props.transitionDurationMs}ms` }}
        >
            <PageLayer level={2}>{props.children}</PageLayer>
        </div>
    );
};
