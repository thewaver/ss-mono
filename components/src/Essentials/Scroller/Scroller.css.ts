import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

export const scrollerRoot = style({
    display: "grid",
    gridTemplateAreas: `"box yBar" "xBar corner"`,
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gridTemplateRows: "minmax(0, 1fr) auto",
    minWidth: 0,
    minHeight: 0,
    maxWidth: "100%",
    maxHeight: "100%",
    isolation: "isolate",
});

export const scrollerBox = style({
    "gridArea": "box",
    "position": "relative",
    "display": "flex",
    "minWidth": 0,
    "minHeight": 0,
    "scrollbarWidth": "none",
    "scrollBehavior": "smooth",

    "@media": {
        "(prefers-reduced-motion: reduce)": {
            scrollBehavior: "auto",
        },
    },
});

globalStyle(`${scrollerBox}::-webkit-scrollbar`, {
    display: "none",
});

export const scrollerBoxVariants = styleVariants({
    x: {
        flexDirection: "row",
    },
    y: {
        flexDirection: "column",
    },
});

export const scrollerBoxBothWays = style({
    alignItems: "flex-start",
});

export const scrollerBoxEnd = style({
    flexGrow: 0,
    flexShrink: 0,
});

export const scrollerBar = style({
    position: "relative",
    zIndex: 1,
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
});

export const scrollerBarVariants = styleVariants({
    x: {
        flexDirection: "row",
    },
    y: {
        flexDirection: "column",
    },
});

export const scrollerBarKeptVariants = styleVariants({
    x: {
        gridArea: "xBar",
    },
    y: {
        gridArea: "yBar",
    },
});

export const scrollerBarOverlaidVariants = styleVariants({
    x: {
        gridArea: "box",
        alignSelf: "end",
    },
    y: {
        gridArea: "box",
        justifySelf: "end",
    },
});
