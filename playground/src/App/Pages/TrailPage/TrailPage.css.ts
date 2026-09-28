import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "center",
});

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
});

export const slider = style({
    display: "flex",
    width: "100%",
    maxWidth: 320,
});

export const SCROLL_BOX_HEIGHT = 140;
export const SCROLL_RUNWAY_HEIGHT = SCROLL_BOX_HEIGHT * 3;

export const scrollBox = style({
    width: "fit-content",
    height: SCROLL_BOX_HEIGHT,
    overflowY: "scroll",
    overscrollBehavior: "contain",
});

export const scrollPinned = style({
    position: "sticky",
    top: 0,
    height: SCROLL_BOX_HEIGHT,
    marginBottom: -SCROLL_BOX_HEIGHT,
});

export const scrollRunway = style({
    height: SCROLL_RUNWAY_HEIGHT,
    marginBlock: SCROLL_BOX_HEIGHT,
});
