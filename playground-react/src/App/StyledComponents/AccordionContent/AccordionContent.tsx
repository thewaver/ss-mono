import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/AccordionContent/AccordionContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { AccordionHeaderProps, AccordionPanelProps } from "./AccordionContent.types";

export const PageAccordionHeader = (props: PropsWithChildren<AccordionHeaderProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.accordionHeader,
                layerClass,
                props.flags.isExpanded && styles.isExpanded,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div>{props.children}</div>

            <div className={styles.accordionMarker} aria-hidden="true">
                ▶
            </div>
        </div>
    );
};

export const PageAccordionPanel = (props: PropsWithChildren<AccordionPanelProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.accordionPanel, layerClass].join(" ")}
            style={{
                opacity: props.visibilityTarget,
                transition: `opacity ${props.transitionDurationMs}ms`,
            }}
        >
            {props.children}
        </div>
    );
};
