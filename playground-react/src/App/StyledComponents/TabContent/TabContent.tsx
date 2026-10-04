import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/TabContent/TabContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabCellProps, TabContentProps, TabDecorationProps, TabFloaterProps } from "./TabContent.types";

export const PageTabContent = (props: PropsWithChildren<TabContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.orientation === "horizontal" ? styles.rowTab : styles.columnTab,
                layerClass,
                props.isSelected && styles.isSelected,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageTabCell = (props: PropsWithChildren<TabCellProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.hexTab,
                layerClass,
                props.isSelected && styles.isSelected,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageTabGutter = (props: TabDecorationProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[props.orientation === "horizontal" ? styles.rowTabGutter : undefined, layerClass].join(" ")}
            data-gutter=""
        />
    );
};

export const PageTabHexFloater = (props: TabFloaterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.hexTabFloater, layerClass, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
            data-floater=""
        />
    );
};

export const PageTabHexHighlightFloater = (props: TabFloaterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.hexTabHighlightFloater, layerClass, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
            data-floater={"highlight"}
        />
    );
};

export const PageTabFloater = (props: TabFloaterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.orientation === "horizontal" ? styles.rowTabFloater : styles.columnTabFloater,
                layerClass,
                props.visibilityTarget === 1 && styles.isVisible,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
            data-floater=""
        />
    );
};

export const PageTabPanelContent = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.tabPanel, layerClass].join(" ")}>{props.children}</div>;
};
