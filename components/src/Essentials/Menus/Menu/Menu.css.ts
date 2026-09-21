import { style } from "@vanilla-extract/css";

import { buttonElement } from "../../Button/Button.css";

export const menuTrigger = style([buttonElement, {}]);

export const menuTriggerHoldable = style({
    touchAction: "none",
    userSelect: "none",
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

export const menuLayoutGroup = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});

export const menuItemRegion = style({
    pointerEvents: "none",
});

export const contextMenuRegion = style({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
});
