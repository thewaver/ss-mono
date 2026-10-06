import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideFloaterProps, GlideLabelProps } from "./GlideFloater.types";

export const PageGlideFloater = (props: GlideFloaterProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={access(props.kind) === "selection" ? styles.selectionGlideFloater : styles.highlightGlideFloater}
            classList={{ [getLayerClass()]: true, [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
            data-floater={access(props.kind)}
        />
    );
};

export const renderPageHighlightFloater = (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => (
    <PageGlideFloater
        kind={"highlight"}
        visibilityTarget={getVisibilityTarget}
        transitionDurationMs={getTransitionDurationMs}
    />
);

export const renderPageSelectionFloater = (getVisibilityTarget: () => 0 | 1, getTransitionDurationMs: () => number) => (
    <PageGlideFloater
        kind={"selection"}
        visibilityTarget={getVisibilityTarget}
        transitionDurationMs={getTransitionDurationMs}
    />
);

export const PageGlideLabel = (props: ParentProps<GlideLabelProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.glideLabel}
            classList={{
                [getLayerClass()]: true,
                [styles.isSelected]: access(props.isSelected),
                [styles.isDisabled]: access(props.isDisabled) ?? false,
            }}
        >
            {props.children}
        </div>
    );
};
