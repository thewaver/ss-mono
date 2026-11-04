import { style } from "@vanilla-extract/css";

export const buttonCursor = style({
    cursor: "pointer",

    selectors: {
        "&:disabled, &[aria-disabled='true']": {
            cursor: "not-allowed",
        },
    },
});

export const buttonElement = style([
    buttonCursor,
    {
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
    },
]);
