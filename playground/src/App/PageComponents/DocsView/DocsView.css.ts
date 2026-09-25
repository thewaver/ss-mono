import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const docsView = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
    maxWidth: 960,
});

export const docsLead = style({
    margin: 0,
    fontSize: themeVars.fontSize.medium,
});

export const docsGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const docsGroupTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
});

export const docsSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const docsTableTitle = style({
    margin: 0,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const docsDescription = style({
    margin: 0,
    fontSize: themeVars.fontSize.small,
});

export const docsEmpty = style({
    opacity: 0.75,
});

export const docsTableScroller = style({
    overflowX: "auto",
    backgroundColor: [themeVars.color.background.dark, `rgba(from ${themeVars.color.background.dark} r g b / 75%)`],
    borderRadius: themeVars.borderRadius.full,
    boxShadow: themeVars.shadow.small,
});

export const docsTable = style({
    borderCollapse: "collapse",
    width: "100%",
    fontSize: themeVars.fontSize.small,
    textAlign: "left",
});

export const docsHeadCell = style({
    borderBottom: `1px solid rgb(from ${themeVars.color.background.contrast} r g b / 25%)`,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    fontWeight: "bold",
});

export const docsCell = style({
    padding: themeVars.spacing.full,
    verticalAlign: "top",

    selectors: {
        [`tr:not(:last-child) > &`]: {
            borderBottom: `1px solid rgb(from ${themeVars.color.background.contrast} r g b / 10%)`,
        },
    },
});

export const docsNameCell = style([docsCell, { whiteSpace: "nowrap", fontFamily: "monospace" }]);

export const docsTypeCell = style([docsCell, { fontFamily: "monospace" }]);

export const docsOptional = style({
    opacity: 0.75,
});

export const docsFlag = style({
    display: "inline-block",
    borderRadius: themeVars.borderRadius.half,
    padding: `2px ${themeVars.spacing.half}`,
    backgroundColor: `rgb(from ${themeVars.color.background.contrast} r g b / 10%)`,
    fontSize: themeVars.fontSize.xSmall,
    whiteSpace: "nowrap",
});

export const docsPending = style({
    opacity: 0.5,
    fontStyle: "italic",
});
