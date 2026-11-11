import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { HoverCardContentProps } from "./HoverCardContentReact.types";

export const PageHoverCardContent = (props: PropsWithChildren<HoverCardContentProps>) => {
    const nextLayerClass = useNextLayerClass();

    return (
        <div
            className={[styles.hoverCardContent, nextLayerClass, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transition: `opacity ${props.transitionDurationMs}ms` }}
        >
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};
