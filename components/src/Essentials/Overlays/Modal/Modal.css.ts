import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

export const modalAlignmentVariants = styleVariants({
    center: {
        justifyItems: "center",
        alignItems: "center",
    },
    left: {
        justifyItems: "left",
        alignItems: "stretch",
    },
    right: {
        justifyItems: "right",
        alignItems: "stretch",
    },
    top: {
        justifyItems: "stretch",
        alignItems: "start",
    },
    bottom: {
        justifyItems: "stretch",
        alignItems: "end",
    },
});

export const modalRoot = style({
    position: "relative",

    display: "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows: "100%",
    width: "100%",
    height: "100%",
});

export const modalOverlay = style({
    position: "absolute",
    inset: 0,
    zIndex: 100,

    display: "grid",
    pointerEvents: "all",
});

export const modalContainer = style({
    zIndex: 100,

    display: "flex",
    flexDirection: "column",
    pointerEvents: "all",
});

globalStyle(`${modalContainer} > *`, {
    flexGrow: 1,
});
