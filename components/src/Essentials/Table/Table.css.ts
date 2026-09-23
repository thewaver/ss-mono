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

const tableMarker = style({
    position: "absolute",
    top: 0,
    bottom: 0,
    pointerEvents: "none",
});

export const tableMarkerBefore = style([tableMarker, { insetInlineStart: 0 }]);

export const tableMarkerAfter = style([tableMarker, { insetInlineEnd: 0 }]);

export const tableResizer = style({
    position: "absolute",
    top: 0,
    insetInlineEnd: 0,
    bottom: 0,
    width: tableResizerWidthVar,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "col-resize",
    touchAction: "none",
    userSelect: "none",
});

export const tableSortControl = style({
    display: "flex",
    border: "none",
    padding: 0,
    background: "none",
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
});

export const tableReorderGrip = style({
    display: "flex",
    border: "none",
    padding: 0,
    background: "none",
    font: "inherit",
    color: "inherit",
    cursor: "grab",
    touchAction: "none",
});

export const tableHint = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    border: 0,
});
