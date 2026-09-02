import { style } from "@vanilla-extract/css";

export const bracketRoot = style({
    position: "relative",
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
    outline: "0 none",
});
