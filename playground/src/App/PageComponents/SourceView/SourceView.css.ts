import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

const SOURCE_VIEW_WIDTH = 1200;

export const sourceViewRoot = style({
    display: "flex",
    flexDirection: "column",
    width: SOURCE_VIEW_WIDTH,
    maxWidth: "100%",
    borderRadius: "inherit",
    overflow: "hidden",
});

export const sourceViewTabs = style({
    flexShrink: 0,
    paddingBlock: themeVars.spacing.double,
    marginInline: themeVars.spacing.double,
});

export const sourceViewPanel = style({
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    paddingInline: themeVars.spacing.double,
    paddingBlockEnd: themeVars.spacing.double,
});

export const sourceViewTabsRow = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const sourceViewTabsCell = style({
    flex: "1 1 0",
    minWidth: 0,
});
