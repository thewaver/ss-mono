import { style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { lookBoundary, lookEntries } from "../../Looks/Look.css";
import { exampleContainer } from "../../PageComponents/Examples/Examples.css";
import { themeVars } from "../../Theme.css";

export const looksPage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
});

export const looksTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const looksDescription = style({
    margin: 0,
    maxWidth: layoutVars.readingWidth,
    fontSize: themeVars.fontSize.medium,
    opacity: 0.75,
});

export const lookRow = style([lookEntries.hollowSurface, { overflow: "hidden" }]);

export const lookSampleBoundary = style([lookBoundary, { isolation: "isolate" }]);

export const lookSamples = style([
    lookEntries.pageBackground,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.double,
    },
]);

export const lookColumns = style({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "start",
    gap: themeVars.spacing.double,
});

export const lookColumn = style([exampleContainer, { alignItems: "start", gap: themeVars.spacing.full }]);

export const lookColumnName = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const lookStateGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const lookBarStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const lookBarCell = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: 200,
});

export const lookBarCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const lookPanel = style([
    lookEntries.panel,
    {
        width: 160,
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
    },
]);

export const lookWideSample = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: 280,
});
