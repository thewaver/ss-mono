import { globalStyle, style } from "@vanilla-extract/css";

export const placementBox = style({
    position: "relative",
    containerType: "inline-size",
});

export const placementSpacer = style({
    width: "100%",
    pointerEvents: "none",
});

export const placementItem = style({
    display: "grid",
    gridTemplate: "100% / 100%",
    placeItems: "center",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "all",
});

/**
 * A placement is a centre before it is a size, so what sits in one stays on that centre whether or not it
 * fits. Left to itself a child sized by its own content pulls the box's only track out with it, out of one
 * side, and the item stops being on its own point — so the track is pinned to the box and what it holds is
 * centred in it. The child is held to at least the box's size as well, so a painter that draws the whole box
 * still has one to draw.
 */
globalStyle(`${placementItem} > *`, {
    minWidth: "100%",
    minHeight: "100%",
});
