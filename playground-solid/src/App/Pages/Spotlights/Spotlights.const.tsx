import { Corners } from "@thewaver/ss-components-solid";
import type { SpotlightOverlayRenderer } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

export const renderOverlay: SpotlightOverlayRenderer = (getVisibilityTarget, getTransitionDurationMs, getMaskStyle) => (
    <div
        class={getVisibilityTarget() === 1 ? styles.overlayOn : styles.overlayOff}
        style={{
            ...getMaskStyle(),
            transition: `background-color ${getTransitionDurationMs()}ms, backdrop-filter ${getTransitionDurationMs()}ms`,
        }}
    />
);

export const renderHighlight = (getVisibilityTarget: () => 0 | 1) => (
    <Corners color={() => (getVisibilityTarget() === 1 ? "yellow" : "transparent")} />
);
