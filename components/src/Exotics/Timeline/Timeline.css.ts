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
    outline: "0 none",
    pointerEvents: "all",
});

globalStyle(`${timelineItem} > *`, {
    height: "100%",
});
