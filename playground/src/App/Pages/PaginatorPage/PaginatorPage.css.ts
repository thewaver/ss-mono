import { style } from "@vanilla-extract/css";

export const DIAL_SIZE = 240;

export const halfDial = style({
    display: "flex",
    alignItems: "center",
});

export const halfDialRing = style({
    flexShrink: 0,
    width: DIAL_SIZE,
    marginInlineStart: -DIAL_SIZE * 0.5,
});

export const halfDialPanel = style({
    position: "relative",
    zIndex: 1,
    order: -1,
    display: "flex",
    minHeight: DIAL_SIZE,
});
