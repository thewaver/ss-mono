import * as styles from "@thewaver/ss-playground/App/StyledComponents/GlideFloater/GlideFloater.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { GlideFloaterProps } from "./GlideFloaterReact.types";

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
