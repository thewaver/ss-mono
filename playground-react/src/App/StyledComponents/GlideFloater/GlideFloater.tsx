import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideFloaterProps, GlideLabelProps } from "./GlideFloater.types";

export const PageGlideFloater = (props: GlideFloaterProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                props.kind === "selection" ? styles.selectionGlideFloater : styles.highlightGlideFloater,
                layerClass,
                props.visibilityTarget === 1 && styles.isVisible,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
            data-floater={props.kind}
        />
    );
};

export const renderPageHighlightFloater = (visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <PageGlideFloater
        kind={"highlight"}
        visibilityTarget={visibilityTarget}
        transitionDurationMs={transitionDurationMs}
    />
);

export const renderPageSelectionFloater = (visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <PageGlideFloater
        kind={"selection"}
        visibilityTarget={visibilityTarget}
        transitionDurationMs={transitionDurationMs}
    />
);

export const PageGlideLabel = (props: PropsWithChildren<GlideLabelProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.glideLabel,
                layerClass,
                props.isSelected && styles.isSelected,
                (props.isDisabled ?? false) && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};
