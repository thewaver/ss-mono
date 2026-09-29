import { style, styleVariants } from "@vanilla-extract/css";

export const sidebarRoot = style({
    position: "relative",
    flexShrink: 0,
    boxSizing: "border-box",
});

export const sidebarRootEdgeVariants = styleVariants({
    left: { height: "100%" },
    right: { height: "100%" },
    top: { width: "100%" },
    bottom: { width: "100%" },
});

export const sidebarPanel = style({
    boxSizing: "border-box",
});

export const sidebarPanelEdgeVariants = styleVariants({
    left: { height: "100%", transitionProperty: "width" },
    right: { height: "100%", transitionProperty: "width" },
    top: { width: "100%", transitionProperty: "height" },
    bottom: { width: "100%", transitionProperty: "height" },
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
    top: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    bottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
    },
});
