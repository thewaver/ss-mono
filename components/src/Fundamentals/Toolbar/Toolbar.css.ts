import { style } from "@vanilla-extract/css";

import { buttonElement } from "../Button/Button.css";

export const toolbarRoot = style({
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
});

export const toolbarItem = style({
    flex: "none",
});

export const toolbarMeasuredItem = style({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden",
    pointerEvents: "none",
});

export const toolbarButton = style([buttonElement, {}]);
