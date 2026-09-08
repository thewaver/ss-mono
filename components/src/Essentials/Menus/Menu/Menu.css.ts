import { style } from "@vanilla-extract/css";

export const menuTrigger = style({
    appearance: "none",
    background: "transparent",
    width: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    color: "inherit !important",
    fontSize: "inherit !important",
    fontWeight: "inherit !important",
    fontFamily: "inherit !important",
    lineHeight: "inherit !important",
    pointerEvents: "all",
    cursor: "pointer",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

export const menuItem = style({
    width: "100%",
    cursor: "pointer",
    pointerEvents: "all",

    selectors: {
        "&[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

export const menuLayoutRoot = style({
    position: "relative",
    containerType: "inline-size",
});

export const menuLayoutSpacer = style({
    width: "100%",
    pointerEvents: "none",
});

export const menuLayoutGroup = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const menuLayoutItem = style({
    display: "grid",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "all",
});

export const menuItemRegion = style({
    pointerEvents: "none",
});
