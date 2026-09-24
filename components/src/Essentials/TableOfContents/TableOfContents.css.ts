import { style } from "@vanilla-extract/css";

import { buttonElement } from "../Button/Button.css";

export const tableOfContentsRoot = style({
    display: "flex",
    maxWidth: "100%",
});

export const tableOfContentsList = style({
    display: "flex",
    alignItems: "stretch",
    maxWidth: "100%",
    margin: 0,
    padding: 0,
    listStyle: "none",
});

export const tableOfContentsEntry = style({
    display: "flex",
    alignItems: "stretch",
    minWidth: 0,
});

export const tableOfContentsItem = style([buttonElement, { textDecoration: "none" }]);

export const tableOfContentsPlacedList = style({
    position: "absolute",
    inset: 0,
    display: "block",
});

export const tableOfContentsLayer = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
});
