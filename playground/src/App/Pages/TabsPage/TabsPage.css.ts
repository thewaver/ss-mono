import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const rowDemo = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
    minWidth: 0,
});

export const columnDemo = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    gap: themeVars.spacing.full,
    width: "100%",
    minWidth: 0,
});

export const columnDemoPanel = style({
    flex: 1,
    minWidth: 0,
});

export const tabsDemo = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
    minWidth: 0,

    selectors: {
        "&[data-orientation='vertical']": {
            flexDirection: "row",
            alignItems: "start",
        },
    },
});

export const tabsDemoPanel = style({
    flex: 1,
    minWidth: 0,
});
