import { globalStyle, style } from "@vanilla-extract/css";

const sortableRoot = style({
    display: "flex",
    flex: "1 1 auto",
    position: "relative",
    margin: 0,
    padding: 0,
    listStyle: "none",
    pointerEvents: "all",
});

export const sortableRow = style([
    sortableRoot,
    { flexDirection: "row", alignItems: "stretch", overflowX: "auto", overflowY: "hidden" },
]);

export const sortableColumn = style([
    sortableRoot,
    { flexDirection: "column", alignItems: "stretch", overflowY: "auto", overflowX: "hidden" },
]);

globalStyle(`${sortableRow} > *, ${sortableColumn} > *`, {
    flex: "0 0 auto",
});

export const sortableItem = style({
    display: "flex",
    flex: "1 1 auto",
    minWidth: 0,
    position: "relative",
    touchAction: "none",
    pointerEvents: "all",
});

const sortableMarker = style({
    display: "flex",
    position: "absolute",
    pointerEvents: "none",
});

export const sortableMarkerRow = style([sortableMarker, { flexDirection: "row", transform: "translateX(-50%)" }]);

export const sortableMarkerColumn = style([sortableMarker, { flexDirection: "column", transform: "translateY(-50%)" }]);

export const sortableCarried = style({
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform",
});

/**
 * The box a landing mark is given is the whole gap between the two neighbours, turned to lie across it. How
 * much of that space to ink is the painter's, so the mark is centred in it rather than stretched to fill it.
 */
export const sortableMarkerPlaced = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
});
