import type { ParentProps } from "solid-js";

import { COLLAPSIBLE_DEFAULTS, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionHeaderProps, AccordionPanelProps } from "./AccordionContentSolid.types";

export const PageAccordionHeader = (props: ParentProps<AccordionHeaderProps>) => {
    const getLayerClass = useLayerClass();
    const getJoinClass = () => styles.headerJoins[access(props.side) ?? COLLAPSIBLE_DEFAULTS.side];

    return (
        <div
            class={styles.accordionHeader}
            classList={{
                [getLayerClass()]: true,
                [styles.isExpanded]: access(props.flags).isExpanded,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [getJoinClass()]: access(props.flags).isExpanded,
            }}
        >
            <div>{props.children}</div>

            <div class={styles.accordionMarker} data-side={access(props.side)} aria-hidden="true">
                ▶
            </div>
        </div>
    );
};

export const PageAccordionPanel = (props: ParentProps<AccordionPanelProps>) => {
    const getLayerClass = useLayerClass();
    const getJoinClass = () => styles.panelJoins[access(props.side) ?? COLLAPSIBLE_DEFAULTS.side];

    return (
        <div
            class={styles.accordionPanel}
            classList={{
                [getLayerClass()]: true,
                [getJoinClass()]: access(props.visibilityTarget) === 1,
            }}
            style={{
                opacity: access(props.visibilityTarget),
                transition: `opacity ${access(props.transitionDurationMs)}ms`,
            }}
        >
            {props.children}
        </div>
    );
};
