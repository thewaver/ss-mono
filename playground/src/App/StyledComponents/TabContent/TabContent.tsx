import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { TabCellProps, TabContentProps, TabDecorationProps, TabFloaterProps } from "./TabContent.types";

import * as styles from "./TabContent.css";

export const PageTabContent = (props: ParentProps<TabContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={access(props.orientation) === "horizontal" ? styles.rowTab : styles.columnTab}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.isSelected),
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageTabCell = (props: ParentProps<TabCellProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.hexTab}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.isSelected),
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageTabGutter = (props: TabDecorationProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[access(props.orientation) === "horizontal" ? styles.rowTabGutter : undefined, getLayerClass()].join(
                " ",
            )}
            data-gutter
        />
    );
};

export const PageTabHexFloater = (props: TabFloaterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.hexTabFloater}
            classList={{ [getLayerClass()]: true, [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
            data-floater
        />
    );
};

export const PageTabFloater = (props: TabFloaterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={access(props.orientation) === "horizontal" ? styles.rowTabFloater : styles.columnTabFloater}
            classList={{ [getLayerClass()]: true, [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
            data-floater
        />
    );
};

export const PageTabPanelContent = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.tabPanel, getLayerClass()].join(" ")}>{props.children}</div>;
};
