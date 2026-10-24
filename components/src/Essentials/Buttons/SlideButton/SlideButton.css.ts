import { style } from "@vanilla-extract/css";

export const slideButtonDescription = style({
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    border: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
});

export const slideButtonElement = style({
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
    touchAction: "none",

    selectors: {
        "&:disabled, &[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});
