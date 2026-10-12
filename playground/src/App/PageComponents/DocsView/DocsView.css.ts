import { style } from "@vanilla-extract/css";

import { LAYOUT } from "../../Layout.const";

import { layoutVars } from "../../Layout.css";
import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";

export const docsLayout = style({
    display: "flex",
    alignItems: "flex-start",
    gap: layoutVars.tableOfContentsGap,
    containerType: "inline-size",
});

export const docsTableOfContents = style({
    "position": "sticky",
    "top": 0,
    "flexShrink": 0,
    "width": layoutVars.tableOfContentsWidth,
    "fontSize": themeVars.fontSize.small,

    "@container": {
        [`(max-width: ${LAYOUT.tableOfContentsMinLayoutWidth}px)`]: {
            display: "none",
        },
    },
});

export const docsView = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    flex: 1,
    minWidth: 0,
    maxWidth: layoutVars.contentWidth,
});

export const docsLead = style({
    maxWidth: layoutVars.readingWidth,
    margin: 0,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "normal",
});

export const docsGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const docsGroupTitle = style({
    margin: 0,
    scrollMarginTop: themeVars.spacing.quad,
    fontSize: themeVars.fontSize.large,
    fontWeight: "normal",
});

export const docsSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const docsTableTitle = style({
    margin: 0,
    scrollMarginTop: themeVars.spacing.quad,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const docsDescription = style({
    maxWidth: layoutVars.readingWidth,
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
    borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    fontWeight: "bold",
});

export const docsCell = style({
    padding: themeVars.spacing.full,
    verticalAlign: "top",

    selectors: {
        [`tr:not(:last-child) > &`]: {
            borderBottom: `1px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
        },
    },
});

export const docsNameCell = style([docsCell, { whiteSpace: "nowrap", fontFamily: "monospace" }]);

export const docsTypeCell = style([docsCell, { fontFamily: "monospace" }]);

export const docsOptional = style({
    opacity: 0.75,
});

export const docsPending = style({
    opacity: 0.5,
    fontStyle: "italic",
});
