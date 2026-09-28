import { Corners } from "@thewaver/ss-components-react";
import type { SpotlightOverlayRenderer } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

export const renderOverlay: SpotlightOverlayRenderer = (visibilityTarget, transitionDurationMs, maskStyle) => (
    <div
        className={visibilityTarget === 1 ? styles.overlayOn : styles.overlayOff}
        style={{
            ...maskStyle,
            transition: `background-color ${transitionDurationMs}ms, backdrop-filter ${transitionDurationMs}ms`,
        }}
    />
);

export const renderHighlight = (visibilityTarget: 0 | 1) => (
    <Corners color={visibilityTarget === 1 ? "yellow" : "transparent"} />
);
