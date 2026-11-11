import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { HoverCardContentProps } from "./HoverCardContentSolid.types";

export const PageHoverCardContent = (props: ParentProps<HoverCardContentProps>) => {
    const getNextLayerClass = useNextLayerClass();

    return (
        <div
            class={[styles.hoverCardContent, getNextLayerClass()].join(" ")}
            classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ transition: `opacity ${access(props.transitionDurationMs)}ms` }}
        >
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};
