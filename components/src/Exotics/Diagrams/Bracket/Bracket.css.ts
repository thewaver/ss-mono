import { style } from "@vanilla-extract/css";

export const bracketWindow = style({
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const bracketRoot = style({
    position: "relative",
    transformOrigin: "0 0",
});

export const bracketConnectors = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    overflow: "visible",
});

export const bracketList = style({
    listStyle: "none",
    margin: 0,
    padding: 0,
});

export const bracketItem = style({
    position: "absolute",
});

export const bracketNode = style({
    width: "100%",
    height: "100%",

    selectors: {
        "&:focus:not(:focus-visible)": {
            outline: "0 none",
        },
    },
});

export const bracketLayerHeader = style({
    position: "absolute",
});
