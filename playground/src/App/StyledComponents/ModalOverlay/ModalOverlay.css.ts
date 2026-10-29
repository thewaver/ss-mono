import { style, styleVariants } from "@vanilla-extract/css";

const opaqueOverlay = style({
    backgroundColor: "black",
});

export const blurredOverlayVariants = styleVariants({
    on: { backdropFilter: "blur(10px) grayscale(75%)" },
    off: { backdropFilter: "none" },
});

export const opaqueOverlayVariants = styleVariants({
    on: [opaqueOverlay, { opacity: 1 }],
    off: [opaqueOverlay, { opacity: 0 }],
});
