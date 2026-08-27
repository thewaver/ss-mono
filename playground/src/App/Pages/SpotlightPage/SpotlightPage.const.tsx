import { Corners } from "@thewaver/ss-components";
import type { SpotlightOverlayRenderer } from "@thewaver/ss-components";

import * as styles from "./SpotlightPage.css";

export const PADDING = 20;

export const TOUR_STEPS = [
    { title: "This is a potato", text: "It sits here and does very little, which is most of its charm." },
    { title: "This one is a turnip", text: "It does the same, but with less enthusiasm and a worse aftertaste." },
];

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
