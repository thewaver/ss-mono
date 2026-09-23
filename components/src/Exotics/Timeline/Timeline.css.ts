import { globalStyle, style } from "@vanilla-extract/css";

export const timelineRoot = style({
    position: "relative",
    width: "100%",
    overflow: "hidden",
});

export const timelineTicks = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const timelineTick = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0,
});

export const timelineMarkers = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const timelineMarker = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0,
});

export const timelineHint = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    border: 0,
});

export const timelineEdge = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    pointerEvents: "all",
    touchAction: "none",
    cursor: "ew-resize",
});

export const timelineList = style({
    position: "absolute",
    inset: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,
});

export const timelineItem = style({
    position: "absolute",
    pointerEvents: "none",
});

export const timelineControl = style({
    width: "100%",
    height: "100%",
    pointerEvents: "all",

    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});

globalStyle(`${timelineItem} > *`, {
    height: "100%",
});
