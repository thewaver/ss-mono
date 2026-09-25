import { style, styleVariants } from "@vanilla-extract/css";

export const sidebarRoot = style({
    position: "relative",
    flexShrink: 0,
    boxSizing: "border-box",
    height: "100%",
});

export const sidebarPanel = style({
    boxSizing: "border-box",
    height: "100%",
    transitionProperty: "width",
});

export const sidebarPanelOverlayVariants = styleVariants({
    left: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    right: {
        position: "absolute",
        top: 0,
        right: 0,
    },
});
