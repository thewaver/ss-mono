import { globalStyle, style } from "@vanilla-extract/css";

export const overheadWheelRoot = style({
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    pointerEvents: "none",
    isolation: "isolate",
});

export const overheadWheelDisc = style({
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    pointerEvents: "auto",
});

export const overheadWheelWedge = style({
    position: "absolute",
    inset: 0,
    transformOrigin: "center center",
    pointerEvents: "none",
});

globalStyle(
    `${overheadWheelWedge} :is(a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"])`,
    { pointerEvents: "auto" },
);

export const drumWheelRoot = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});
