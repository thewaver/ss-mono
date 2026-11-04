import { globalStyle, style } from "@vanilla-extract/css";

import { SKIN_COLUMN_MIN_WIDTH } from "./SkinsPage.const";

import { layoutVars } from "../../Layout.css";
import { exampleContainer } from "../../PageComponents/Examples/Examples.css";
import { skinBoundary, skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const skinsPage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
});

globalStyle(`${skinsPage} > [role="radiogroup"]`, {
    width: "100%",
});

export const skinsTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const skinsDescription = style({
    margin: 0,
    maxWidth: layoutVars.readingWidth,
    fontSize: themeVars.fontSize.medium,
    opacity: 0.75,
});

export const skinRow = style([skinEntries.hollowSurface, { overflow: "hidden" }]);

export const skinSampleBoundary = style([skinBoundary, { isolation: "isolate" }]);

export const skinSamples = style([
    skinEntries.pageBackground,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.double,
    },
]);

export const skinColumns = style({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${SKIN_COLUMN_MIN_WIDTH}px, 1fr))`,
    gap: themeVars.spacing.double,
});

export const skinColumn = style([exampleContainer, { alignItems: "start", gap: themeVars.spacing.full }]);

export const skinWideColumn = style({ gridColumn: "span 2" });

export const skinColumnName = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const skinStateGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    width: "100%",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const skinFittedStateGrid = style({ justifyContent: "start" });

export const skinBarStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const skinBarCell = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: "100%",
});

export const skinBarCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const skinPanel = style([
    skinEntries.panel,
    {
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
    },
]);

export const skinWideSample = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});
