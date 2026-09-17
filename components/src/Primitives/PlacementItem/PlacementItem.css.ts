import { globalStyle, style } from "@vanilla-extract/css";

// const PROXIMITY_TRANSITION_MS = "50ms";

export const placementItem = style({
    display: "grid",
    gridTemplate: "100% / 100%",
    placeItems: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "all",
    // transition: `transform ${PROXIMITY_TRANSITION_MS}, filter ${PROXIMITY_TRANSITION_MS}`,
});

globalStyle(`${placementItem} > *`, {
    minWidth: "100%",
    minHeight: "100%",
});
