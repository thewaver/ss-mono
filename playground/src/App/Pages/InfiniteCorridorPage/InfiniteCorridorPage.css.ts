import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const CORRIDOR_HEIGHT = 320;

export const stage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "center",
    width: "100%",
});

export const frame = style({
    width: "100%",
    height: CORRIDOR_HEIGHT,
});

export const scrollBox = style({
    width: "100%",
    height: CORRIDOR_HEIGHT,
    overflowY: "scroll",
    overscrollBehavior: "contain",
});

export const scrollPinned = style({
    position: "sticky",
    top: 0,
    height: CORRIDOR_HEIGHT,
    marginBottom: -CORRIDOR_HEIGHT,
});

export const scrollRunway = style({
    marginBlock: CORRIDOR_HEIGHT,
});

export const room = style({
    "display": "grid",
    "placeItems": "center",
    "width": "100%",
    "height": "100%",
    "padding": themeVars.spacing.full,
    "border": "none",
    "borderRadius": themeVars.borderRadius.full,
    "color": "white",
    "fontSize": themeVars.fontSize.small,
    "textAlign": "center",
    "cursor": "pointer",
    "userSelect": "none",
    ":focus-visible": {
        outline: `3px solid ${themeVars.color.primary.main}`,
        outlineOffset: 2,
    },
});
