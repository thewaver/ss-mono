import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const apiView = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
});

export const apiGroup = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const apiGroupTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
});

export const apiSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const apiTableTitle = style({
    margin: 0,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const apiDescription = style({
    margin: 0,
    maxWidth: 900,
    fontSize: themeVars.fontSize.small,
    lineHeight: 1.6,
});

export const apiEmpty = style({
    opacity: 0.75,
});

export const apiTableScroller = style({
    width: "100%",
    overflowX: "auto",
});

export const apiTable = style({
    borderCollapse: "collapse",
    width: "100%",
    fontSize: themeVars.fontSize.small,
    textAlign: "left",
});

export const apiHeadCell = style({
    borderBottom: `1px solid rgb(from ${themeVars.color.background.contrast} r g b / 25%)`,
    padding: themeVars.spacing.full,
    whiteSpace: "nowrap",
    fontWeight: "bold",
});

export const apiCell = style({
    borderBottom: `1px solid rgb(from ${themeVars.color.background.contrast} r g b / 10%)`,
    padding: themeVars.spacing.full,
    verticalAlign: "top",
});

export const apiNameCell = style([apiCell, { whiteSpace: "nowrap", fontFamily: "monospace" }]);

export const apiTypeCell = style([apiCell, { fontFamily: "monospace" }]);

export const apiOptional = style({
    opacity: 0.6,
});

export const apiFlag = style({
    display: "inline-block",
    borderRadius: themeVars.borderRadius.half,
    padding: `2px ${themeVars.spacing.half}`,
    backgroundColor: `rgb(from ${themeVars.color.background.contrast} r g b / 12%)`,
    fontSize: themeVars.fontSize.xSmall,
    whiteSpace: "nowrap",
});

export const apiPending = style({
    opacity: 0.5,
    fontStyle: "italic",
});
