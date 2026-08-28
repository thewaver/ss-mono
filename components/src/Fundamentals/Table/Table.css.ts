import { createVar, style } from "@vanilla-extract/css";

export const tableTemplateVar = createVar();
export const tableResizerWidthVar = createVar();

export const tableRoot = style({
    display: "block",
    width: "100%",
});

export const tableHeader = style({
    position: "sticky",
    top: 0,
    zIndex: 1,
});

export const tableBody = style({
    position: "relative",
    width: "100%",
});

export const tableRow = style({
    display: "grid",
    gridTemplateColumns: tableTemplateVar,
    width: "100%",
});

export const tableWindowedRow = style({
    position: "absolute",
    top: 0,
    left: 0,
});

export const tableCell = style({
    position: "relative",
    minWidth: 0,
});

export const tableResizer = style({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: tableResizerWidthVar,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "col-resize",
    touchAction: "none",
    userSelect: "none",
});
