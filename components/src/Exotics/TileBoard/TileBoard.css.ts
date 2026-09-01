import { globalStyle, style } from "@vanilla-extract/css";

export const tileBoardRoot = style({
    display: "block",
    position: "relative",
    zIndex: 0,
    pointerEvents: "none",
});

export const tileBoardRow = style({
    display: "block",
    position: "absolute",
    width: 0,
    height: 0,
    pointerEvents: "none",
});

export const tileBoardCell = style({
    display: "block",
    position: "absolute",
    top: 0,
    pointerEvents: "none",
});

export const tileBoardTile = style({
    display: "block",
    position: "relative",
    pointerEvents: "none",
});

export const tileBoardPaint = style({
    display: "flex",
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const tileBoardHit = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "all",
});

globalStyle(`${tileBoardTile} ${tileBoardPaint} *`, {
    pointerEvents: "none",
});
